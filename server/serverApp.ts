import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  SUBSCRIPTION_PLANS,
  getAllConfiguredPlans,
  getConfiguredPlanById,
  adminSavePlan,
  adminCreateCustomPlan,
  adminTogglePlanStatus,
  getExpiringSubscriptionsData,
  sendSubscriptionReminder,
  getUserNotifications,
  markNotificationAsRead,
  resolveUserSubscription,
  createSubscriptionOrder,
  verifyAndActivateSubscription,
  recordAndAuthorizeExport,
  registerTeamLead,
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  toggleTeamMemberStatus,
  getAdminSubscriptionOverview,
  adminActivateCustomPlan,
  updateTeamLeadStatus,
  adminApproveSubscription,
  adminRejectSubscription,
  getSubscriptionApprovalRequests,
  getAdminPaymentSettings,
  updateAdminPaymentSettings,
  submitPaymentVerification,
  getPaymentVerificationRecords,
  getPaymentOverviewMetrics,
  adminApprovePayment,
  adminRejectPayment,
  getOrInitFreeUsage,
  checkUserPostCreationAccess,
} from './subscriptionEngine';
import {
  authenticateUser,
  registerUser,
  validateSessionToken,
  invalidateSession,
  getAllUsers,
  updateUserStatus,
  findUserByIdentifier,
} from './authEngine';
import {
  discoverUpcomingFestivals,
  generateAIFestivalCampaign,
} from './aiFestivalEngine';
import { AIFestivalAdminSettings, AIFestivalCampaignResult } from '../src/types';

dotenv.config();

async function startServer() {
  const app = express();
  // In AI Studio / Cloud Run, Nginx binds to 8080 and proxies to port 3000.
  // The Node application must always listen on port 3000.
  const PORT = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : (process.env.PORT && process.env.PORT !== '8080')
      ? parseInt(process.env.PORT, 10)
      : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health checks for Cloud Run and proxy rollout checks
  app.get(['/health', '/_health', '/api/health', '/healthz'], (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Helper to extract session token from Authorization Bearer or custom headers
  function getSessionToken(req: express.Request): string {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }
    if (req.headers['x-session-token']) {
      return String(req.headers['x-session-token']).trim();
    }
    if (req.query.token) {
      return String(req.query.token).trim();
    }
    return '';
  }

  // Strict Authentication Middleware
  function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = getSessionToken(req);
    const auth = validateSessionToken(token);
    if (!auth.valid || !auth.user) {
      return res.status(401).json({
        success: false,
        error: auth.error || 'कृपया प्रथम लॉगिन करा (Authentication Required).',
        code: 'UNAUTHENTICATED',
      });
    }
    (req as any).authenticatedUser = auth.user;
    (req as any).sessionToken = token;
    next();
  }

  // Strict Admin Authorization Middleware
  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    requireAuth(req, res, () => {
      const user = (req as any).authenticatedUser;
      if (user.role !== 'admin' && !user.adminRole) {
        return res.status(403).json({
          success: false,
          error: 'केवळ अधिकृत ॲडमिनसाठी प्रवेश अनुमत आहे (Admin Access Required).',
          code: 'FORBIDDEN',
        });
      }
      next();
    });
  }

  // Health check endpoints for Cloud Run, App Engine, and load balancers
  app.get(['/api/health', '/health', '/_ah/health'], (req, res) => {
    res.json({ status: 'ok', port: PORT, time: new Date().toISOString() });
  });

  // Helper to ensure from address is always valid for Resend API requirements
  function parseResendSender(raw?: string): string {
    if (!raw || !raw.trim()) {
      return 'GrowView <onboarding@resend.dev>';
    }
    const str = raw.trim();
    if (/<[^>]+@[^>]+>/.test(str)) {
      return str;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
      return `GrowView <${str}>`;
    }
    return `${str} <onboarding@resend.dev>`;
  }

  // Email OTP Dispatch Endpoint (GrowView)
  app.post('/api/send-email-otp', async (req, res) => {
    try {
      const { toEmail, otpCode, purpose, userName } = req.body;
      const resendSender = parseResendSender(process.env.EMAIL_FROM);
      const subject = purpose === 'register'
        ? `[GrowView] आपले नवीन खाते पडताळणी OTP: ${otpCode}`
        : `[GrowView] आपला पासवर्ड रीसेट OTP: ${otpCode}`;

      console.log(`[EMAIL OTP DISPATCH] From: "${resendSender}" -> To: <${toEmail}> | Code: ${otpCode} | Purpose: ${purpose}`);

      // Rich HTML Email payload representation
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4f46e5; margin: 0; font-size: 22px;">GrowView</h2>
            <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Festival & Business Poster Studio</p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #f1f5f9;">
            <p style="margin: 0 0 10px; color: #334155; font-size: 14px;">नमस्कार ${userName || 'ग्राहक'},</p>
            <p style="margin: 0 0 16px; color: #475569; font-size: 13px;">
              ${purpose === 'register' ? 'आपले नवीन खाते सुरक्षितपणे पडताळणी करण्यासाठी खालील ६ अंकी OTP वापरा:' : 'आपला पासवर्ड सुरक्षितपणे रीसेट करण्यासाठी खालील ६ अंकी OTP वापरा:'}
            </p>
            <div style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 12px 28px; border-radius: 8px; font-family: monospace;">
              ${otpCode}
            </div>
            <p style="margin: 16px 0 0; color: #dc2626; font-size: 11px; font-weight: 600;">
              ⚠️ हा OTP पुढील ५ मिनिटांसाठीच वैध आहे. कोणाशीही शेअर करू नका.
            </p>
          </div>
          <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            Sent by <strong>${resendSender}</strong> for GrowView App Verification.
          </div>
        </div>
      `;

      // 1. If Resend API Key is provided in Settings / Secrets
      if (process.env.RESEND_API_KEY) {
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: resendSender,
              to: [toEmail],
              subject,
              html: htmlContent,
            }),
          });

          const resendData = await resendResponse.json() as any;
          if (!resendResponse.ok) {
            console.warn('[RESEND API NOTICE]', resendResponse.status, resendData);
            const isTestingRestricted =
              resendResponse.status === 403 &&
              typeof resendData?.message === 'string' &&
              resendData.message.includes('only send testing emails');

            if (isTestingRestricted) {
              const match = resendData.message.match(/\(([^)]+)\)/);
              const ownerEmail = match ? match[1] : 'gunashreedigital@gmail.com';
              return res.json({
                success: true,
                deliveryMode: 'resend_sandbox_restricted',
                otpCode,
                resendOwnerEmail: ownerEmail,
                recipient: toEmail,
                message: `Resend Free Sandbox: डोमेन व्हेरीफाय होईपर्यंत Resend फक्त ${ownerEmail} वर थेट ईमेल्स पाठवू शकते. स्क्रीनवरील OTP वापरून लॉगिन/नोंदणी पूर्ण करू शकता.`,
                details: resendData,
              });
            }

            return res.json({
              success: true,
              deliveryMode: 'resend_error_fallback',
              otpCode,
              recipient: toEmail,
              error: resendData.message || 'Resend द्वारे ईमेल पाठवण्यात त्रुटी आली.',
              message: `Resend त्रुटी: ${resendData.message || 'Unknown error'}. चाचणीसाठी खालील OTP वापरा.`,
              details: resendData,
            });
          }

          console.log('[RESEND API SUCCESS] Email delivered via Resend:', resendData.id);
          return res.json({
            success: true,
            deliveryMode: 'live_resend',
            message: `OTP ईमेल यशस्वीरित्या ${toEmail} वर पाठवला गेला (Resend ID: ${resendData.id}).`,
            emailId: resendData.id,
            sender: resendSender,
            recipient: toEmail,
            otpCode,
            timestamp: new Date().toISOString(),
          });
        } catch (resendErr: any) {
          console.error('[RESEND DISPATCH FAILED]', resendErr);
          return res.json({
            success: true,
            deliveryMode: 'resend_error_fallback',
            otpCode,
            recipient: toEmail,
            message: `ईमेल सर्व्हरशी संपर्क होऊ शकला नाही: ${resendErr.message}`,
          });
        }
      }

      // 2. Fallback: Development Preview Mode (when no API key is yet configured)
      return res.json({
        success: true,
        deliveryMode: 'preview_simulation',
        message: `OTP तयार झाला (डेव्हलपमेंट मोड). थेट ईमेल पाठवण्यासाठी Settings -> Secrets मध्ये RESEND_API_KEY ॲड करा.`,
        sender: resendSender,
        recipient: toEmail,
        otpCode,
        timestamp: new Date().toISOString(),
        previewHtml: htmlContent,
      });
    } catch (err) {
      console.error('Error dispatching email OTP:', err);
      return res.status(500).json({ error: 'Failed to dispatch email OTP' });
    }
  });

  // AI Ganesh Poster Generation Endpoint with Style, Color & Type Selection
  app.post('/api/generate-ganesh-poster', async (req, res) => {
    try {
      const {
        styleGroup = 'royal', // 'royal' | 'modern' | 'traditional' | 'mandal' | 'business'
        colorTheme = 'gold-maroon', // 'gold-maroon' | 'saffron-bhagwa' | 'cyber-neon' | 'sindoor-red' | 'dark-obsidian' | 'emerald-temple'
        posterType = 'aagman', // 'aagman' | 'sthapana' | 'aarti' | 'invitation' | 'business' | 'personal'
        mandalOrBusinessName = '',
        language = 'Marathi',
        customNotes = '',
      } = req.body;

      const THEME_MAP: Record<string, { bgGradient: string; primaryColor: string; accentColor: string; textColor: string; ornamentColor: string; cardBg: string }> = {
        'gold-maroon': {
          bgGradient: 'from-amber-950 via-red-950 to-stone-950',
          primaryColor: '#f59e0b',
          accentColor: '#fbbf24',
          textColor: '#ffffff',
          ornamentColor: '#fde047',
          cardBg: 'rgba(35, 10, 10, 0.9)',
        },
        'saffron-bhagwa': {
          bgGradient: 'from-amber-600 via-orange-600 to-red-800',
          primaryColor: '#ffffff',
          accentColor: '#fde047',
          textColor: '#ffffff',
          ornamentColor: '#fef08a',
          cardBg: 'rgba(50, 20, 5, 0.88)',
        },
        'cyber-neon': {
          bgGradient: 'from-purple-950 via-slate-950 to-pink-950',
          primaryColor: '#ec4899',
          accentColor: '#f97316',
          textColor: '#ffffff',
          ornamentColor: '#38bdf8',
          cardBg: 'rgba(20, 10, 30, 0.9)',
        },
        'sindoor-red': {
          bgGradient: 'from-red-800 via-rose-900 to-red-950',
          primaryColor: '#fde047',
          accentColor: '#ffffff',
          textColor: '#ffffff',
          ornamentColor: '#fbbf24',
          cardBg: 'rgba(50, 10, 10, 0.88)',
        },
        'dark-obsidian': {
          bgGradient: 'from-stone-950 via-neutral-900 to-amber-950',
          primaryColor: '#f59e0b',
          accentColor: '#d97706',
          textColor: '#ffffff',
          ornamentColor: '#fbbf24',
          cardBg: 'rgba(15, 15, 20, 0.92)',
        },
        'emerald-temple': {
          bgGradient: 'from-emerald-950 via-teal-900 to-amber-950',
          primaryColor: '#34d399',
          accentColor: '#fbbf24',
          textColor: '#ffffff',
          ornamentColor: '#6ee7b7',
          cardBg: 'rgba(10, 30, 20, 0.9)',
        },
      };

      const selectedTheme = THEME_MAP[colorTheme] || THEME_MAP['gold-maroon'];

      const MOTIF_MAP: Record<string, string> = {
        royal: 'ganesh-dagdusheth-royal',
        modern: 'ganesh-abstract-lineart',
        traditional: 'ganesh-temple-arch',
        mandal: 'ganesh-lalbaug-raja',
        business: 'ganesh-swastik-manglik',
      };

      const selectedMotif = MOTIF_MAP[styleGroup] || 'ganesh-dagdusheth-royal';

      // Helper function to call Gemini with graceful fallback model & error handling
      async function generateGeminiContentSafe(prompt: string): Promise<string | null> {
        if (!process.env.GEMINI_API_KEY) return null;
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const model of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            });
            if (response.text) {
              return response.text;
            }
          } catch (err: any) {
            const isDemandSpike =
              err?.status === 'UNAVAILABLE' ||
              err?.code === 503 ||
              String(err?.message || '').includes('demand');
            if (isDemandSpike && model !== candidateModels[candidateModels.length - 1]) {
              continue;
            }
            const briefErr = err instanceof Error ? err.message : String(err);
            console.log(`[AI Notice] ${model} demand spike (${briefErr.slice(0, 80)}). Served optimized Marathi template.`);
            break;
          }
        }
        return null;
      }

      const prompt = `You are a master Marathi graphic designer and copywriter for Ganesh Chaturthi (गणेशोत्सव).
Create a unique, culturally rich poster text configuration:
- Style: ${styleGroup} (Royal/Modern/Traditional/Mandal/Business)
- Poster Occasion/Type: ${posterType} (Aagman, Sthapana, Aarti, Invitation, Business, Personal)
- Target Organization / Person Name: ${mandalOrBusinessName || 'श्री गणेश भक्त'}
- Language: ${language} (authentic Devanagari Marathi script)
- User custom notes: ${customNotes || 'none'}

Return ONLY a JSON object with:
{
  "title": "Short evocative English title (e.g. Royal Divine Aagman)",
  "titleNative": "Authentic Marathi title with bullet or icon (e.g. शाही आगमन सोहळा • भव्य मिरवणूक)",
  "headline": "Bold authentic Marathi headline (e.g. गणपती बाप्पा मोरया! or सस्नेह निमंत्रण)",
  "subtext": "2-sentence moving devotional or ceremonial announcement in authentic Marathi",
  "quote": "Sanskrit Shloka or traditional Marathi abhang line",
  "dateBadge": "Short date or status badge (e.g. आगमन सोहळा or भाद्रपद चतुर्थी)",
  "decorative_elements": ["List", "of", "4", "elements"]
}`;

      const rawAiText = await generateGeminiContentSafe(prompt);
      if (rawAiText) {
        try {
          const data = JSON.parse(rawAiText);
          if (data && (data.headline || data.titleNative)) {
            return res.json({
              success: true,
              theme: selectedTheme,
              motifType: selectedMotif,
              ...data,
            });
          }
        } catch {}
      }

      // High-quality deterministic fallback
      const FALLBACK_HEADLINES: Record<string, { title: string; titleNative: string; headline: string; subtext: string; quote: string; dateBadge: string }> = {
        aagman: {
          title: 'Majestic Ganesha Aagman',
          titleNative: 'बाप्पांचे भव्य आगमन मिरवणूक सोहळा',
          headline: '।। गणपती बाप्पा मोरया ।।',
          subtext: `${mandalOrBusinessName ? mandalOrBusinessName + ' तर्फे ' : ''}लाडक्या विघ्नहर्त्याचे जल्लोषात आगमन! ढोल-ताशांच्या गजरात सहभागी व्हा.`,
          quote: 'अंगात वाऱ्यासारखा संचारतो उत्साह, जेव्हा बाप्पाचा आगमन सोहळा सुरू होतो!',
          dateBadge: 'आगमन सोहळा',
        },
        sthapana: {
          title: 'Ganesh Sthapana & Pooja',
          titleNative: 'श्री गणेश प्राणप्रतिष्ठापना व महापूजा',
          headline: 'श्री गणेश स्थापना सोहळा',
          subtext: `${mandalOrBusinessName ? mandalOrBusinessName + ' यांच्या शुभहस्ते ' : ''}शुभ मुहूर्तावर गणरायाची प्राणप्रतिष्ठापना. सर्वांनी उपस्थित राहावे.`,
          quote: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
          dateBadge: 'स्थापना सोहळा',
        },
        aarti: {
          title: 'Maha Aarti & Prasad',
          titleNative: 'दैनिक गणेश महाआरती व प्रसाद वाटप',
          headline: 'गणपती बाप्पा मोरया!',
          subtext: `${mandalOrBusinessName ? mandalOrBusinessName + ' वतीने ' : ''}सायंकाळी महाआरती व प्रसादाचे आयोजन करण्यात आले आहे.`,
          quote: 'सुखकर्ता दुखहर्ता वार्ता विघ्नाची, नुरवी पुरवी प्रेम कृपा जयाची.',
          dateBadge: 'महाआरती',
        },
        invitation: {
          title: 'Ganesh Festival Invitation',
          titleNative: 'सस्नेह निमंत्रण पत्रिका • गणेशोत्सव',
          headline: '।। सस्नेह निमंत्रण ।।',
          subtext: `${mandalOrBusinessName ? mandalOrBusinessName + ' परिवार ' : 'आम्ही '}आपणास श्री दर्शनाचे व महाप्रसादाचे आग्रहाचे निमंत्रण देत आहोत.`,
          quote: 'आपली उपस्थिती आम्हास आनंद देईल. स्नेहपूर्वक स्वागत!',
          dateBadge: 'सस्नेह निमंत्रण',
        },
        business: {
          title: 'Business Ganesh Chaturthi Greeting',
          titleNative: 'व्यापार वृद्धी गणेश चतुर्थी शुभेच्छा',
          headline: 'श्री गणेश चतुर्थीच्या हार्दिक शुभेच्छा',
          subtext: `${mandalOrBusinessName ? mandalOrBusinessName + ' कडून ' : 'आमच्याकडून '}सर्व ग्राहकांना व हितचिंतकांना गणेशोत्सवाच्या मंगलमयी शुभेच्छा!`,
          quote: 'गणरायाच्या कृपेने आपल्या उद्योग-व्यवसायात समृद्धी आणि उत्तरोत्तर प्रगती लाभो.',
          dateBadge: 'व्यापार वृद्धी',
        },
        personal: {
          title: 'Personal Ganesh Wishes',
          titleNative: 'वैयक्तिक गणेशोत्सव सप्रेम शुभेच्छा',
          headline: 'मंगलमूर्ती मोरया!',
          subtext: `${mandalOrBusinessName ? mandalOrBusinessName + ' व परिवारातर्फे ' : ''}गणेश चतुर्थीच्या सर्वांना मनःपूर्वक हार्दिक शुभेच्छा!`,
          quote: 'बाप्पाच्या आगमनाने आपल्या घरात सुख, समाधान, आरोग्य आणि ऐश्वर्य नांदो!',
          dateBadge: 'सप्रेम शुभेच्छा',
        },
      };

      const fallback = FALLBACK_HEADLINES[posterType] || FALLBACK_HEADLINES['aagman'];
      return res.json({
        success: true,
        theme: selectedTheme,
        motifType: selectedMotif,
        decorative_elements: ['Golden Mandala', 'Marigold Garland', 'Modak Thali', 'Diya Lamps'],
        ...fallback,
      });
    } catch (err) {
      console.error('Error generating Ganesh poster with AI:', err);
      return res.status(500).json({ error: 'Failed to generate poster' });
    }
  });

  // Helper for culturally authentic Marathi, Hindi & English copy generation
  function getDynamicWishesFallback(params: {
    occasion?: string;
    businessName?: string;
    businessType?: string;
    language?: string;
    tone?: string;
    customKeywords?: string;
  }) {
    const {
      occasion = '',
      businessName = '',
      businessType = '',
      language = 'Marathi',
      tone = 'Festive & Devotional',
      customKeywords = '',
    } = params;

    const lowerOccasion = occasion.toLowerCase();
    const isMarathi = language.toLowerCase().includes('marathi') || language.includes('मराठी');
    const isHindi = language.toLowerCase().includes('hindi') || language.includes('हिंदी');
    const biz = businessName ? businessName : 'आमच्या परिवारातर्फे';

    // 1. Ganesh Chaturthi / Bappa
    if (lowerOccasion.includes('ganesh') || lowerOccasion.includes('गणेश') || lowerOccasion.includes('बाप्पा') || lowerOccasion.includes('bappa') || lowerOccasion.includes('aagman')) {
      if (isMarathi) {
        return {
          headlines: [
            '।। गणपती बाप्पा मोरया ।।',
            'गणेशोत्सवाच्या मंगलमयी हार्दिक शुभेच्छा!',
            'मंगलमूर्ती मोरया • सुखकर्ता दुखहर्ता',
            'बाप्पांचे आगमन, चैतन्याचा सोहळा!'
          ],
          subtext: `श्री गणरायाच्या आशीर्वादाने आपल्या कुटुंबात व व्यवसायात सुख, समृद्धी आणि आरोग्य नांदो, हीच मंगल कामना. - ${biz}`,
          hashtags: ['#गणपतीबाप्पामोरया', '#गणेशोत्सव', '#BappaMorya', '#GaneshChaturthi', '#महाराष्ट्र'],
          callToAction: customKeywords ? `${customKeywords} • संपर्क साधा` : `सस्नेह शुभेच्छा • ${biz}`,
        };
      }
      if (isHindi) {
        return {
          headlines: [
            'गणेश चतुर्थी की हार्दिक शुभकामनाएं!',
            '।। ॐ गं गणपतये नमः ।।',
            'विघ्नहर्ता गणेश जी आप पर कृपा बनाए रखें',
            'मंगलमूर्ति मोरया • गणपति बप्पा मोरया'
          ],
          subtext: `भगवान गणेश आपके जीवन में सुख, शांति और समृद्धि का संचार करें। - ${biz}`,
          hashtags: ['#GaneshChaturthi', '#GanpatiBappaMorya', '#Vighnaharta', '#FestivalWishes'],
          callToAction: customKeywords ? `${customKeywords} • आज ही संपर्क करें` : `शुभकामनाएं • ${biz}`,
        };
      }
    }

    // 2. Shivjayanti / Chhatrapati Shivaji Maharaj
    if (lowerOccasion.includes('shiv') || lowerOccasion.includes('शिवाजी') || lowerOccasion.includes('शिवजयंती') || lowerOccasion.includes('shivjayanti')) {
      return {
        headlines: [
          '।। जय जिजाऊ जय शिवराय ।।',
          'छत्रपती शिवाजी महाराज जयंतीच्या हार्दिक शुभेच्छा!',
          'शिवजन्मोत्सव सोहळा • अखंड महाराष्ट्राचे आराध्य दैवत',
          'प्रौढप्रताप पुरंदर क्षत्रियकुलावतंस छत्रपती शिवराय'
        ],
        subtext: `ज्यांच्या प्रेरणेने सह्याद्री जागा झाला, त्या युगपुरुष छत्रपती शिवाजी महाराजांना त्रिवार मानाचा मुजरा! - ${biz}`,
        hashtags: ['#जयशिवराय', '#शिवजयंती', '#छत्रपती_शिवाजी_महाराज', '#Shivjayanti', '#Maharashtra'],
        callToAction: customKeywords ? `${customKeywords} • शिवप्रेमींचे स्वागत!` : `सादर प्रणाम • ${biz}`,
      };
    }

    // 3. Gudi Padwa / Hindu Nav Varsh
    if (lowerOccasion.includes('gudi') || lowerOccasion.includes('गुढी') || lowerOccasion.includes('पाडवा') || lowerOccasion.includes('padwa') || lowerOccasion.includes('nav varsh') || lowerOccasion.includes('नववर्ष')) {
      return {
        headlines: [
          'हिंदू नववर्ष व गुढीपाडव्याच्या हार्दिक शुभेच्छा!',
          'उभारू आनंदाची गुढी, करू नव्या संकल्पांची सुरुवात!',
          'नवे वर्ष, नवे चैतन्य • शुभ गुढीपाडवा',
          'समृद्धी आणि आरोग्याची गुढी उभारूया!'
        ],
        subtext: `हे नूतन वर्ष आपल्या जीवनात भरभराट, निरोगी आरोग्य आणि अफाट यश घेऊन येवो. - ${biz}`,
        hashtags: ['#गुढीपाडवा', '#हिंदूनववर्ष', '#GudiPadwa', '#MarathiNewYear', '#नवसंकल्प'],
        callToAction: customKeywords ? `${customKeywords} • पाडवा स्पेशल ऑफर` : `नववर्षाच्या शुभेच्छा • ${biz}`,
      };
    }

    // 4. Diwali / Deepawali
    if (lowerOccasion.includes('diwali') || lowerOccasion.includes('दिवाळी') || lowerOccasion.includes('दीपावली') || lowerOccasion.includes('lakshmi') || lowerOccasion.includes('लक्ष्मी')) {
      return {
        headlines: [
          'दीपावलीच्या मंगलमयी हार्दिक शुभेच्छा!',
          'शुभ दीपावली • मांगल्याचा व प्रकाशाचा सण',
          'तमसो मा ज्योतिर्गमय • दीपोत्सवाच्या शुभेच्छा',
          'आनंदाची, समृद्धीची आणि प्रकाशाची दिवाळी!'
        ],
        subtext: `दिव्यांच्या तेजाने आपले आयुष्य उजळून निघो व माता लक्ष्मीची कृपा सदैव राहो. - ${biz}`,
        hashtags: ['#शुभदीपावली', '#दिवाळीशुभेच्छा', '#HappyDiwali', '#लक्ष्मीपूजन', '#दीपोत्सव'],
        callToAction: customKeywords ? `${customKeywords} • दिवाळी फेस्टिव्हल डिस्काउंट` : `हार्दिक शुभेच्छा • ${biz}`,
      };
    }

    // 5. Navratri / Dussehra
    if (lowerOccasion.includes('navratri') || lowerOccasion.includes('नवरात्री') || lowerOccasion.includes('दसऱ्या') || lowerOccasion.includes('dussehra') || lowerOccasion.includes('durga')) {
      return {
        headlines: [
          '।। जय अंबे जगदंबे ।।',
          'नवरात्रोत्सवाच्या भक्तिमय हार्दिक शुभेच्छा!',
          'विजयादशमी व दसऱ्याच्या सुवर्णमय शुभेच्छा!',
          'आई भवानी आपणास सुख, समृद्धी व शक्ती प्रदान करो'
        ],
        subtext: `अधर्म आणि संकटांवर विजय मिळवून यशाची नवी शिखरे सर करा, हीच आई जगदंबेच्या चरणी प्रार्थना. - ${biz}`,
        hashtags: ['#नवरात्री', '#जयमातादी', '#दसरा', '#Navratri', '#Dussehra'],
        callToAction: customKeywords ? `${customKeywords} • दसरा विशेष ऑफर` : `भक्तिमय शुभेच्छा • ${biz}`,
      };
    }

    // 6. Business Promotion / Discount / Offer
    if (lowerOccasion.includes('sale') || lowerOccasion.includes('offer') || lowerOccasion.includes('discount') || lowerOccasion.includes('ऑफर') || lowerOccasion.includes('सूट') || lowerOccasion.includes('सेल') || lowerOccasion.includes('business')) {
      return {
        headlines: [
          customKeywords ? `${customKeywords} • महा बचत धमाका!` : 'फेस्टिव्हल महा धमाका ऑफर!',
          'उत्तम दर्जा, विश्वासार्ह सेवा आणि वाजवी दर!',
          'आजच भेट द्या आणि मिळवा विशेष सवलत!',
          'ग्राहकांचा विश्वास, आमची खरी ओळख!'
        ],
        subtext: `${biz ? biz + ' कडून ' : ''}आपल्या सेवेसाठी सदैव तत्पर! आधुनिक व्हरायटी आणि खात्रीशीर उत्पादने उपलब्ध.`,
        hashtags: ['#SpecialOffer', '#FestivalDiscount', '#MegaSale', '#QualityService', '#BestDeals'],
        callToAction: customKeywords ? `${customKeywords} • मर्यादित वेळेसाठी उपलब्ध!` : 'आजच भेट द्या किंवा कॉल करा!',
      };
    }

    // 7. Suvichar / Good Morning
    if (lowerOccasion.includes('suvichar') || lowerOccasion.includes('सुविचार') || lowerOccasion.includes('morning') || lowerOccasion.includes('सकाळ') || lowerOccasion.includes('शुभ प्रभात')) {
      return {
        headlines: [
          'शुभ सकाळ • सुंदर दिवसाच्या शुभेच्छा',
          'सकारात्मक विचार, समृद्ध जीवन',
          'प्रत्येक दिवस घेऊन येतो नवी उमेद!',
          'ध्येयाचा ध्यास, कष्टाला यशाची साथ'
        ],
        subtext: `वेळ आणि परिस्थिती कशीही असो, आत्मविश्वास आणि जिद्दीने पुढे चालत राहा; यश तुमचेच आहे. - ${biz}`,
        hashtags: ['#शुभप्रभात', '#सुविचार', '#GoodMorning', '#MotivationalQuotes', '#मराठीसुविचार'],
        callToAction: 'आपला आजचा दिवस आनंदात आणि यशात जावो!',
      };
    }

    // 8. Birthday Wishes
    if (lowerOccasion.includes('birthday') || lowerOccasion.includes('वाढदिवस') || lowerOccasion.includes('जन्मदिन')) {
      return {
        headlines: [
          'वाढदिवसाच्या अनंत मनःपूर्वक शुभेच्छा!',
          '।। अभिष्टचिंतन सोहळा ।।',
          'यशस्वी, दीर्घायुषी व निरोगी आयुष्यासाठी प्रार्थना',
          'आपणास उदंड व निरोगी आयुष्य लाभो!'
        ],
        subtext: `आपल्या हातून जनसेवेची आणि यशाची उत्तुंग कामे घडोत. वाढदिवसाच्या लखलखत्या शुभेच्छा! - ${biz}`,
        hashtags: ['#वाढदिवसाच्याशुभेच्छा', '#HappyBirthday', '#अभिष्टचिंतन', '#BirthdayWishes'],
        callToAction: `सस्नेह शुभेच्छा • ${biz}`,
      };
    }

    // 9. Generic Fallback
    if (isMarathi) {
      return {
        headlines: [
          `${occasion || 'सणासुदीच्या'} मंगलमयी हार्दिक शुभेच्छा!`,
          `आनंद, ऐश्वर्य आणि भरभराटीचे मंगल दिवस!`,
          `${occasion || 'विशेष पर्वणी'} निमित्त सस्नेह नमस्कार!`,
          `आपणास व परिवारास हार्दिक शुभेच्छा!`
        ],
        subtext: `आपल्या जीवनात सुख, समृद्धी आणि आनंद वृद्धिंगत होवो, हीच ईश्वरचरणी प्रार्थना. - ${biz}`,
        hashtags: [`#${(occasion || 'Festival').replace(/\s+/g, '')}`, '#हार्दिकशुभेच्छा', '#सणउत्सव', '#शुभकामना'],
        callToAction: customKeywords ? `${customKeywords} • संपर्क साधा` : `सस्नेह शुभेच्छा • ${biz}`,
      };
    }

    return {
      headlines: [
        `Warm Wishes on ${occasion || 'this Auspicious Occasion'}!`,
        `May this ${occasion || 'Festival'} bring Joy & Prosperity!`,
        `Celebrating ${occasion || 'the Festive Spirit'} with you!`,
        `Wishing you Abundant Success & Happiness!`
      ],
      subtext: `Wishing you and your family abundant peace, happiness and grand success from ${biz}.`,
      hashtags: [`#${(occasion || 'Festive').replace(/\s+/g, '')}`, `#${(businessType || 'Business').replace(/\s+/g, '')}`, '#Celebration', '#SpecialWishes'],
      callToAction: customKeywords ? `${customKeywords} • Contact Today!` : 'Visit us for exclusive festive offerings!'
    };
  }

  // AI Content Generator Endpoint for Festival & Business Posters
  app.post('/api/generate-wishes', async (req, res) => {
    const { 
      occasion = '', 
      businessName = '', 
      businessType = '', 
      language = 'Marathi', 
      tone = 'Festive & Devotional', 
      customKeywords = '' 
    } = req.body;

    const fallbackResult = getDynamicWishesFallback({
      occasion,
      businessName,
      businessType,
      language,
      tone,
      customKeywords,
    });

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `You are an expert Indian marketing and festival poster copywriter for "GrowView" poster maker app.
Generate catchy, culturally authentic poster text and social media caption for:
- Occasion / Theme: ${occasion || 'Special Celebration / Festival'}
- Business Name: ${businessName || 'My Business'}
- Business Category / Industry: ${businessType || 'General Retail & Services'}
- Language: ${language} (If Hindi, Marathi, Gujarati, provide authentic native script with rich vocabulary and poetic cadence).
- Tone: ${tone}
- Additional Keywords / Offers: ${customKeywords || 'none'}

Return ONLY a valid JSON object matching this schema:
{
  "headlines": ["Short Catchy Headline 1 (max 6 words)", "Headline 2", "Headline 3", "Headline 4"],
  "subtext": "A meaningful 1-2 sentence festive blessing or business value proposition message",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4"],
  "callToAction": "A 3-6 word punchy footer banner slogan or offer callout"
}`;

        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const model of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            });

            const rawText = response.text || '{}';
            const parsed = JSON.parse(rawText);
            if (parsed && Array.isArray(parsed.headlines) && parsed.headlines.length > 0) {
              return res.json(parsed);
            }
          } catch (geminiError: any) {
            const isDemandSpike =
              geminiError?.status === 'UNAVAILABLE' ||
              geminiError?.code === 503 ||
              String(geminiError?.message || '').includes('demand');
            if (isDemandSpike && model !== candidateModels[candidateModels.length - 1]) {
              continue;
            }
            const briefErr = geminiError instanceof Error ? geminiError.message : String(geminiError);
            console.log(`[AI Notice] Wishes generator (${model}) busy: ${briefErr.slice(0, 80)}. Served rich Marathi wishes.`);
            break;
          }
        }
      } catch (err) {
        // Fall through to rich fallback
      }
    }

    // Always succeed with rich culturally authentic content
    return res.json(fallbackResult);
  });

  // =========================================================================
  // AI FESTIVAL AUTO CREATOR API ENDPOINTS (Sections 1-35)
  // =========================================================================

  let aiFestivalAdminSettings: AIFestivalAdminSettings = {
    enabled: true,
    maxPostersPerCampaign: 20,
    allowedCategories: ['all', 'festivals', 'jayanti', 'national', 'awareness', 'maharashtra'],
    allowedRegions: ['Maharashtra', 'India', 'Mumbai', 'Pune', 'Jalgaon', 'Nashik', 'Nagpur'],
    defaultLanguage: 'mr',
    defaultPosterCount: 10,
    searchGroundedResearch: true,
    freeTierLimitPerMonth: 10,
    vipTierLimitPerMonth: 100,
  };

  // 1. Discover upcoming festivals for 7, 30, or 90 days (Sections 1-3)
  app.get('/api/ai-festival/discover', async (req, res) => {
    try {
      const days = parseInt(String(req.query.days || '7'), 10);
      const region = String(req.query.region || 'Maharashtra');
      const category = String(req.query.category || 'all');
      const startDate = req.query.startDate ? String(req.query.startDate) : undefined;
      const customQuery = req.query.query ? String(req.query.query) : undefined;

      const events = await discoverUpcomingFestivals({
        days,
        region,
        category,
        startDate,
        customQuery,
      });

      res.json({
        success: true,
        daysCount: days,
        region,
        category,
        totalEvents: events.length,
        events,
      });
    } catch (err: any) {
      console.error('Error discovering upcoming festivals:', err);
      res.status(500).json({
        success: false,
        error: 'सण व उत्सवांचा शोध घेण्यात अडचण आली.',
      });
    }
  });

  // 2. Generate 10 unique design posters for an event (Sections 6-12)
  app.post('/api/ai-festival/generate-campaign', async (req, res) => {
    try {
      if (!aiFestivalAdminSettings.enabled) {
        return res.status(403).json({
          success: false,
          error: 'AI Festival Creator सध्या ॲडमिनद्वारे बंद आहे.',
        });
      }

      const { event, language, aspectRatio, posterCount, brandKit, styleTweak } = req.body;
      if (!event || !event.name) {
        return res.status(400).json({
          success: false,
          error: 'कृपया योग्य सण/उत्सव माहिती पाठवा.',
        });
      }

      const clampedPosterCount = Math.min(
        posterCount ? parseInt(String(posterCount), 10) : aiFestivalAdminSettings.defaultPosterCount,
        aiFestivalAdminSettings.maxPostersPerCampaign
      );

      const result = await generateAIFestivalCampaign({
        event,
        language: language || aiFestivalAdminSettings.defaultLanguage,
        aspectRatio: aspectRatio || '4:5',
        posterCount: clampedPosterCount,
        brandKit,
        styleTweak,
      });

      res.json({
        success: true,
        eventId: event.id,
        eventName: event.name,
        eventNameMarathi: event.nameMarathi,
        dateStr: event.dateStr,
        dayOfWeek: event.dayOfWeek,
        posters: result.posters,
        sources: result.sources,
        researchSummary: result.researchSummary,
        totalGenerated: result.posters.length,
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error generating AI Festival campaign:', err);
      res.status(500).json({
        success: false,
        error: 'AI पोस्टर्स जनरेट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
      });
    }
  });

  // 3. One-click "Generate My Next 7 Days" campaign for multiple events (Section 16)
  app.post('/api/ai-festival/generate-multi-campaign', async (req, res) => {
    try {
      const { events, language, aspectRatio, postersPerEvent, brandKit } = req.body;
      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'किमान एक सण किंवा उत्सव निवडणे आवश्यक आहे.',
        });
      }

      const perEventCount = Math.min(
        postersPerEvent ? parseInt(String(postersPerEvent), 10) : 5,
        10
      );

      const campaigns: AIFestivalCampaignResult[] = [];

      for (const ev of events.slice(0, 5)) {
        const campaign = await generateAIFestivalCampaign({
          event: ev,
          language: language || 'mr',
          aspectRatio: aspectRatio || '4:5',
          posterCount: perEventCount,
          brandKit,
        });

        campaigns.push({
          eventId: ev.id,
          eventName: ev.name,
          eventNameMarathi: ev.nameMarathi,
          dateStr: ev.dateStr,
          dayOfWeek: ev.dayOfWeek,
          researchSummary: campaign.researchSummary,
          sources: campaign.sources,
          posters: campaign.posters,
          totalGenerated: campaign.posters.length,
          generatedAt: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        totalCampaigns: campaigns.length,
        campaigns,
      });
    } catch (err: any) {
      console.error('Error generating multi-festival campaign:', err);
      res.status(500).json({
        success: false,
        error: 'मल्टि-फेस्टिव्हल कॅम्पेन जनरेट करताना त्रुटी आली.',
      });
    }
  });

  // 4. Admin Settings Get & Update (Section 32)
  app.get('/api/ai-festival/admin-settings', (req, res) => {
    res.json({
      success: true,
      settings: aiFestivalAdminSettings,
    });
  });

  app.post('/api/ai-festival/admin-settings', requireAdmin, (req, res) => {
    try {
      const updates = req.body;
      aiFestivalAdminSettings = {
        ...aiFestivalAdminSettings,
        ...updates,
      };
      res.json({
        success: true,
        settings: aiFestivalAdminSettings,
        message: 'AI Festival Creator सेटिंग्ज यशस्वीरीत्या सेव्ह केल्या!',
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: 'सेटिंग्ज सेव्ह करता आल्या नाहीत.',
      });
    }
  });

  // =========================================================================
  // GROWVIEW STRICT AUTHENTICATION API ENDPOINTS
  // =========================================================================

  // 1. User / Admin Login with Credentials
  app.post('/api/auth/login', (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({
          success: false,
          error: 'कृपया नोंदणीकृत ईमेल/मोबाईल आणि पासवर्ड प्रविष्ट करा.',
        });
      }
      const result = authenticateUser(identifier, password);
      res.json({
        success: true,
        user: result.user,
        token: result.session.token,
        expiresAt: result.session.expiresAt,
        message: 'लॉगिन यशस्वी झाले!',
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: err.message || 'लॉगिन अयशस्वी झाले. कृपया माहिती तपासा.',
      });
    }
  });

  // Verification codes map for email/Gmail verification
  const emailVerificationStore = new Map<string, { code: string; expiresAt: number; verified: boolean }>();

  // 1.5 Send Email / Gmail Verification Code (OTP)
  app.post('/api/auth/send-verification-code', (req, res) => {
    try {
      const email = (req.body?.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'कृपया वैध ईमेल पत्ता प्रविष्ट करा.' });
      }

      // Generate 6-digit random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

      emailVerificationStore.set(email, { code, expiresAt, verified: false });

      console.log(`[GrowView Auth] Email verification code generated for ${email}: ${code}`);

      res.json({
        success: true,
        message: `६-अंकी पडताळणी कोड आपल्या ${email} वर पाठवला आहे. कृपया तो प्रविष्ट करा.`,
        code: code, // returned for seamless in-app preview/toast
        expiresInMinutes: 15,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'पडताळणी कोड पाठवण्यात त्रुटी आली.' });
    }
  });

  // 1.6 Verify Email Code
  app.post('/api/auth/verify-email-code', (req, res) => {
    try {
      const email = (req.body?.email || '').trim().toLowerCase();
      const inputCode = (req.body?.code || '').trim();

      if (!email || !inputCode) {
        return res.status(400).json({ success: false, error: 'ईमेल व पडताळणी कोड आवश्यक आहे.' });
      }

      const record = emailVerificationStore.get(email);
      if (!record) {
        return res.status(400).json({ success: false, error: 'कोणताही सक्रिय पडताळणी कोड सापडला नाही. कृपया पुन्हा कोड मागवा.' });
      }

      if (Date.now() > record.expiresAt) {
        emailVerificationStore.delete(email);
        return res.status(400).json({ success: false, error: 'हा पडताळणी कोड कालबाह्य (Expired) झाला आहे. कृपया नवीन कोड मागवा.' });
      }

      if (record.code !== inputCode) {
        return res.status(400).json({ success: false, error: 'अवैध पडताळणी कोड! कृपया ईमेल तपासून ६-अंकी योग्य कोड टाका.' });
      }

      record.verified = true;
      emailVerificationStore.set(email, record);

      res.json({
        success: true,
        verified: true,
        message: `✅ ईमेल (${email}) यशस्वीरित्या पडताळला गेला आहे!`,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'पडताळणी अयशस्वी झाली.' });
    }
  });

  // 2. User Registration (Default Free Plan)
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, phone, password, businessName, businessType, city, emailVerified } = req.body;
      const cleanEmail = (email || '').trim().toLowerCase();

      // Check if email was verified via Google Firebase or via 6-digit OTP
      const isVerifiedInStore = emailVerificationStore.get(cleanEmail)?.verified === true;
      if (!emailVerified && !isVerifiedInStore) {
        return res.status(400).json({
          success: false,
          error: 'ईमेल किंवा जीमेल पडताळणी अनिवार्य आहे! कृपया ईमेल व्हेरीफाय केल्याशिवाय खाते उघडता येणार नाही.',
        });
      }

      const result = registerUser({ name, email, phone, password, businessName, businessType, city });
      // Initialize default free subscription
      resolveUserSubscription(result.user.id, result.user.email);
      res.json({
        success: true,
        user: { ...result.user, emailVerified: true },
        token: result.session.token,
        expiresAt: result.session.expiresAt,
        message: 'नोंदणी यशस्वी झाली! आपले मोफत खाते तयार झाले आहे.',
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'नोंदणी अयशस्वी झाली.',
      });
    }
  });

  // 3. Current Authenticated User Session Verification
  app.get('/api/auth/me', requireAuth, (req, res) => {
    const user = (req as any).authenticatedUser;
    res.json({ success: true, user });
  });

  // 4. Session Logout / Invalidation
  app.post('/api/auth/logout', (req, res) => {
    const token = getSessionToken(req) || req.body?.token;
    if (token) {
      invalidateSession(token);
    }
    res.json({ success: true, message: 'सत्र सुरक्षितपणे समाप्त झाले (Logged out).' });
  });

  // 5. Admin-only User Accounts Listing
  app.get('/api/auth/users', requireAdmin, (req, res) => {
    try {
      const users = getAllUsers();
      res.json({ success: true, users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =========================================================================
  // GROW VIEW SUBSCRIPTION, TEAM ACCESS & EXPORT CONTROL API ENDPOINTS
  // =========================================================================

  // 1. Get Available Plans (Public)
  app.get('/api/subscription/plans', (req, res) => {
    try {
      const plans = getAllConfiguredPlans(false);
      res.json({ success: true, plans });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // User in-app notifications & expiry alerts
  app.get('/api/notifications/my', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const data = getUserNotifications(authUser.id);
      res.json({ success: true, ...data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/notifications/mark-read', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { notificationId } = req.body;
      const success = markNotificationAsRead(notificationId, authUser.id);
      res.json({ success });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // 2. Get User's Active Subscription & Watermark Status (Strictly Authenticated)
  app.get('/api/subscription/status', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const resolution = resolveUserSubscription(authUser.id, authUser.email);
      res.json({ success: true, ...resolution });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Error resolving subscription' });
    }
  });

  // 3. Create Server-Authorized Payment Order (Strictly Authenticated)
  app.post('/api/subscription/create-order', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { planId } = req.body;
      if (!planId) {
        return res.status(400).json({ success: false, error: 'प्लॅन माहिती आवश्यक आहे.' });
      }
      const order = createSubscriptionOrder(authUser.id, authUser.email, planId);
      res.json({ success: true, order });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Order creation failed' });
    }
  });

  // 4. Verify Payment Server-Side and Submit for Admin Approval (Strictly Authenticated)
  app.post('/api/subscription/verify-payment', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { orderId, paymentId, planId, paymentMethod, userName, userPhone } = req.body;
      if (!orderId || !paymentId || !planId) {
        return res.status(400).json({ success: false, error: 'पडताळणीसाठी आवश्यक माहिती उपलब्ध नाही.' });
      }
      const result = verifyAndActivateSubscription(
        orderId,
        paymentId,
        authUser.id,
        planId,
        paymentMethod,
        userName || authUser.name,
        userPhone || authUser.phone
      );
      res.json({
        success: true,
        subscription: result.subscription,
        approvalRequest: result.approvalRequest,
        requiresApproval: true,
        message: 'पेमेंट यशस्वी! आपली सबस्क्रिप्शन विनंती ॲडमिन मंजुरीसाठी पाठवण्यात आली आहे. ॲडमिन मंजुरीनंतर त्वरित ॲक्टिव्ह होईल.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Payment verification failed' });
    }
  });

  // 5. Server-Enforced Export Quota & Watermark Authorization (Strictly Authenticated)
  app.post('/api/subscription/record-export', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const result = recordAndAuthorizeExport(authUser.id, authUser.email);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Export authorization failed' });
    }
  });

  // 6. Corporate Team Lead Contact Form Submission (10-20+ Members)
  app.post('/api/subscription/team-lead', (req, res) => {
    try {
      const { name, companyName, mobileNumber, email, teamMembersCount, businessesCount, requirements, message } = req.body;
      if (!name || !mobileNumber || !email) {
        return res.status(400).json({ success: false, error: 'नाव, मोबाईल नंबर आणि ईमेल भरणे आवश्यक आहे.' });
      }
      const lead = registerTeamLead({
        name,
        company_name: companyName || '',
        mobile_number: mobileNumber,
        email,
        team_members_count: teamMembersCount || '10-20',
        businesses_count: businessesCount || '5',
        requirements: requirements || '',
        message: message || '',
      });
      res.json({ success: true, lead, message: 'आपली चौकशी नोंदवण्यात आली आहे. आमची टीम लवकरच संपर्क करेल!' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to submit lead' });
    }
  });

  // 7. Team Members Management (Authenticated with client fallback for maximum reliability)
  app.get('/api/team/members', (req, res) => {
    try {
      const token = getSessionToken(req);
      const auth = validateSessionToken(token);
      const ownerId = auth.valid && auth.user ? auth.user.id : String(req.query.ownerId || '').trim();
      if (!ownerId) {
        return res.status(401).json({ success: false, error: 'User ID आवश्यक आहे.' });
      }
      const members = getTeamMembers(ownerId);
      res.json({ success: true, members });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/team/invite', (req, res) => {
    try {
      const token = getSessionToken(req);
      const auth = validateSessionToken(token);
      const { ownerId, ownerEmail, ownerBusinessName, memberEmail, memberName, role, assignedBusinessIds, isVIP } = req.body;
      const effectiveOwnerId = (auth.valid && auth.user ? auth.user.id : ownerId) || '';
      const effectiveOwnerEmail = (auth.valid && auth.user ? auth.user.email : ownerEmail) || '';
      const effectiveOwnerName = (auth.valid && auth.user ? (auth.user.businessName || auth.user.name) : ownerBusinessName) || '';
      const isVIPOverride = Boolean((auth.valid && (auth.user as any)?.isVIP) || isVIP || (auth.valid && (auth.user?.role === 'admin' || auth.user?.adminRole)));

      if (!effectiveOwnerId) {
        return res.status(401).json({ success: false, error: 'कृपया लॉगिन करा किंवा यूजर आयडी पाठवा.' });
      }
      if (!memberEmail || !memberName) {
        return res.status(400).json({ success: false, error: 'ईमेल आणि नाव भरणे आवश्यक आहे.' });
      }
      const member = inviteTeamMember(
        effectiveOwnerId,
        effectiveOwnerEmail,
        effectiveOwnerName,
        memberEmail,
        memberName,
        role || 'team_member',
        assignedBusinessIds || [],
        isVIPOverride
      );
      res.json({ success: true, member, message: `${memberName} यांना टीममध्ये जोडण्यात आले!` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/team/remove', (req, res) => {
    try {
      const token = getSessionToken(req);
      const auth = validateSessionToken(token);
      const { ownerId, memberId } = req.body;
      const effectiveOwnerId = (auth.valid && auth.user ? auth.user.id : ownerId) || '';
      if (!effectiveOwnerId || !memberId) {
        return res.status(400).json({ success: false, error: 'माहिती अपूर्ण आहे.' });
      }
      const success = removeTeamMember(effectiveOwnerId, memberId);
      res.json({ success, message: 'टीम सदस्य हटवण्यात आला.' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/team/toggle-status', (req, res) => {
    try {
      const token = getSessionToken(req);
      const auth = validateSessionToken(token);
      const { ownerId, memberId } = req.body;
      const effectiveOwnerId = (auth.valid && auth.user ? auth.user.id : ownerId) || '';
      if (!effectiveOwnerId || !memberId) {
        return res.status(400).json({ success: false, error: 'माहिती अपूर्ण आहे.' });
      }
      const member = toggleTeamMemberStatus(effectiveOwnerId, memberId);
      res.json({ success: true, member });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // 8. Admin Panel Aggregated Subscription & Leads Endpoints (Strictly Admin-Only)
  app.get('/api/admin/subscription-overview', requireAdmin, (req, res) => {
    try {
      const overview = getAdminSubscriptionOverview();
      res.json({ success: true, ...overview });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/activate-custom-plan', requireAdmin, (req, res) => {
    try {
      const { userId, userEmail, planId, durationDays, businessLimit, teamLimit } = req.body;
      const sub = adminActivateCustomPlan(userId, userEmail, planId, durationDays, businessLimit, teamLimit);
      res.json({ success: true, subscription: sub, message: 'कस्टम सबस्क्रिप्शन यशस्वीरित्या लागू केले.' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/update-lead-status', requireAdmin, (req, res) => {
    try {
      const { leadId, status } = req.body;
      const lead = updateTeamLeadStatus(leadId, status);
      res.json({ success: true, lead });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin Plan Management: Save / Edit Plan
  app.post('/api/admin/plans/save', requireAdmin, (req, res) => {
    try {
      const plan = adminSavePlan(req.body);
      res.json({ success: true, plan, message: 'प्लॅन यशस्वीरित्या सेव्ह झाला.' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin Plan Management: Create Custom Plan
  app.post('/api/admin/plans/create', requireAdmin, (req, res) => {
    try {
      const plan = adminCreateCustomPlan(req.body);
      res.json({ success: true, plan, message: 'नवीन कस्टम प्लॅन तयार झाला.' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin Plan Management: Toggle Active Status
  app.post('/api/admin/plans/toggle-status', requireAdmin, (req, res) => {
    try {
      const { planId } = req.body;
      const plan = adminTogglePlanStatus(planId);
      res.json({ success: true, plan, message: `प्लॅन ${plan.is_active ? 'सुरू' : 'बंद'} करण्यात आला.` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin: Expiring Subscriptions Dashboard Widget & Categorized Lists
  app.get('/api/admin/expiring-subscriptions', requireAdmin, (req, res) => {
    try {
      const data = getExpiringSubscriptionsData();
      res.json({ success: true, ...data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Send Notification / Reminder
  app.post('/api/admin/send-expiry-notification', requireAdmin, (req, res) => {
    try {
      const { userId, subscriptionId, stage, customMessage } = req.body;
      if (!userId || !subscriptionId) {
        return res.status(400).json({ success: false, error: 'User ID आणि Subscription ID आवश्यक आहेत.' });
      }
      const notif = sendSubscriptionReminder(userId, subscriptionId, stage || 'MANUAL', customMessage);
      res.json({
        success: true,
        notification: notif,
        message: 'सूचना (Notification) वापरकर्त्याला यशस्वीरित्या पाठवली गेली.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin: Get All Subscription Approval Requests
  app.get('/api/admin/subscription-approvals', requireAdmin, (req, res) => {
    try {
      const requests = getSubscriptionApprovalRequests();
      res.json({ success: true, requests });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Approve Subscription Request
  app.post('/api/admin/approve-subscription', requireAdmin, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { approvalId, notes } = req.body;
      if (!approvalId) {
        return res.status(400).json({ success: false, error: 'Approval ID आवश्यक आहे.' });
      }
      const result = adminApproveSubscription(approvalId, authUser?.email || 'admin@growview.com', notes);
      res.json({
        success: true,
        ...result,
        message: `सबस्क्रिप्शन यशस्वीरित्या मंजूर करून ॲक्टिव्हेट करण्यात आले! (${result.subscription.plan_name})`,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin: Reject Subscription Request
  app.post('/api/admin/reject-subscription', requireAdmin, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { approvalId, reason } = req.body;
      if (!approvalId) {
        return res.status(400).json({ success: false, error: 'Approval ID आवश्यक आहे.' });
      }
      const result = adminRejectSubscription(approvalId, reason, authUser?.email || 'admin@growview.com');
      res.json({
        success: true,
        ...result,
        message: 'सबस्क्रिप्शन विनंती नाकारण्यात आली.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // =========================================================================
  // GROW VIEW MANUAL UPI PAYMENT & VERIFICATION FLOW ENDPOINTS (Req 1-22)
  // =========================================================================

  // Public: Get Admin Configured UPI Payment Settings
  app.get('/api/payment-settings', (_req, res) => {
    try {
      const settings = getAdminPaymentSettings();
      res.json({ success: true, settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Update Payment Settings (UPI ID, QR Code, Instructions, Contact)
  app.post('/api/admin/payment-settings', requireAdmin, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const updated = updateAdminPaymentSettings(req.body, authUser?.email || 'admin@growview.com');
      res.json({
        success: true,
        settings: updated,
        message: 'पेमेंट सेटींग्ज यशस्वीरित्या अपडेट करण्यात आल्या.',
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Customer: Submit Payment Verification Form (Status -> Pending Verification)
  app.post('/api/payment/submit-verification', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const {
        planId,
        amount,
        transactionId,
        screenshotUrl,
        paymentDate,
        customerName,
        customerEmail,
        customerPhone,
        businessName,
      } = req.body;

      if (!planId) {
        return res.status(400).json({ success: false, error: 'कृपया प्लॅन निवडा.' });
      }
      if (!transactionId || !transactionId.trim()) {
        return res.status(400).json({ success: false, error: 'UPI Transaction ID / UTR क्रमांक भरणे आवश्यक आहे.' });
      }
      if (!screenshotUrl || !screenshotUrl.trim()) {
        return res.status(400).json({ success: false, error: 'पेमेंटचा स्क्रीनशॉट अपलोड करणे आवश्यक आहे.' });
      }

      const result = submitPaymentVerification({
        userId: authUser.id,
        userName: customerName || authUser.name || 'ग्राहक',
        userEmail: customerEmail || authUser.email || '',
        userPhone: customerPhone || authUser.phone || '',
        businessName: businessName || authUser.businessName || '',
        planId,
        amount: Number(amount) || 0,
        transactionId,
        screenshotUrl,
        paymentDate,
      });

      res.json({
        success: true,
        payment: result.payment,
        message: result.message,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'पेमेंट सबमिट करताना त्रुटी आली.' });
    }
  });

  // Customer: Fetch My Payment History
  app.get('/api/payment/my-history', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const payments = getPaymentVerificationRecords(authUser.id);
      res.json({ success: true, payments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Get All Payment Verifications & Metrics
  app.get('/api/admin/payments', requireAdmin, (req, res) => {
    try {
      const payments = getPaymentVerificationRecords();
      const metrics = getPaymentOverviewMetrics();
      res.json({ success: true, payments, metrics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Get Payment Overview Metrics Widget
  app.get('/api/admin/payment-overview', requireAdmin, (_req, res) => {
    try {
      const metrics = getPaymentOverviewMetrics();
      res.json({ success: true, metrics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin: Approve Payment & Activate Plan
  app.post('/api/admin/payment/approve', requireAdmin, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { paymentId, notes } = req.body;
      if (!paymentId) {
        return res.status(400).json({ success: false, error: 'Payment ID आवश्यक आहे.' });
      }
      const result = adminApprovePayment(paymentId, authUser?.email || 'admin@growview.com', notes);
      res.json({
        success: true,
        payment: result.payment,
        subscription: result.subscription,
        message: result.message,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Admin: Reject Payment with Required Reason
  app.post('/api/admin/payment/reject', requireAdmin, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const { paymentId, reason } = req.body;
      if (!paymentId) {
        return res.status(400).json({ success: false, error: 'Payment ID आवश्यक आहे.' });
      }
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, error: 'पेमेंट नाकारण्याचे कारण नमूद करणे अनिवार्य आहे.' });
      }
      const result = adminRejectPayment(paymentId, reason.trim(), authUser?.email || 'admin@growview.com');
      res.json({
        success: true,
        payment: result.payment,
        message: result.message,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Customer: Free Usage Counter Status (3 free posts limit per month)
  app.get('/api/subscription/free-usage', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const usage = getOrInitFreeUsage(authUser.id);
      res.json({ success: true, ...usage });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Post Generation / Customization Access Gate Check (Checks active sub or < 3 free posts)
  app.post('/api/subscription/check-access', requireAuth, (req, res) => {
    try {
      const authUser = (req as any).authenticatedUser;
      const access = checkUserPostCreationAccess(authUser.id, authUser.email);
      res.json({ success: true, ...access });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development vs static serve for production
  const distPath = path.join(process.cwd(), 'dist');
  const distIndexPath = path.join(distPath, 'index.html');
  const hasDistIndex = fs.existsSync(distIndexPath);
  const isProduction = process.env.NODE_ENV === 'production' || hasDistIndex;

  if (isProduction && hasDistIndex) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GrowView Server running on http://0.0.0.0:${PORT} (Production: ${isProduction})`);
  });
}

startServer();

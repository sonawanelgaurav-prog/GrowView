import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Database,
  Download,
  Upload,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Key,
  Shield,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { FeatureFlagsConfig, UserAccount, PosterTemplate } from '../../types';
import { INITIAL_FEATURE_FLAGS } from '../../data/adminMockData';

interface AdminSettingsBackupTabProps {
  users: UserAccount[];
  templates: PosterTemplate[];
  onImportBackup?: (data: any) => void;
}

export const AdminSettingsBackupTab: React.FC<AdminSettingsBackupTabProps> = ({
  users,
  templates,
  onImportBackup,
}) => {
  const [flags, setFlags] = useState<FeatureFlagsConfig>(INITIAL_FEATURE_FLAGS);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // API Keys state
  const [geminiKey, setGeminiKey] = useState('AIzaSyD_Live_Production_Key_GrowView2026');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_89104810283');
  const [firebaseAppId, setFirebaseAppId] = useState('1:955029900247:web:8a9b2c3d4e');

  const handleToggleFlag = (key: keyof FeatureFlagsConfig) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccessToast(`Feature flag '${key}' अपडेट झाला!`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // 1-Click Database Snapshot Backup
  const handleDownloadBackup = () => {
    const backupData = {
      version: '2.8.4',
      exportDate: new Date().toISOString(),
      app: 'GrowView Festival & Business Poster Maker',
      totalUsers: users.length,
      users,
      templates,
      featureFlags: flags,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GrowView_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setSuccessToast('डेटाबेस बॅकअप JSON फाइल यशस्वीरित्या डाऊनलोड झाली!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Export CSV Report
  const handleExportCSV = (type: 'users' | 'revenue') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'users') {
      csvContent += 'User ID,Name,Email,Phone,City,Plan,Total Downloads,Created At\n';
      users.forEach((u) => {
        csvContent += `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.city || 'N/A'}","${
          u.subscriptionPlan || 'free'
        }","${u.totalDownloads}","${u.createdAt}"\n`;
      });
    } else {
      csvContent += 'Date,Category,Revenue,Orders,Gateway Share\n';
      csvContent += '2026-08-29,Festival Posters,14250,22,UPI 48% / Play 45%\n';
      csvContent += '2026-08-28,Business Packs,18900,28,UPI 42% / Play 48%\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GrowView_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessToast(`CSV अहवाल डाऊनलोड झाला: ${type}_report.csv`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Grid: Remote Feature Flags + Database Backup / Report Exporters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remote Feature Flags */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>रिमोट फीचर फ्लॅग्ज (Remote Feature Flags)</span>
            </h4>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Zero-Deploy Toggles
            </span>
          </div>

          <p className="text-xs text-slate-400">
            ॲप अपडेट न करता थेट सर्वरवरून वैशिष्ट्ये सुरू अथवा बंद करा:
          </p>

          <div className="space-y-3 pt-1">
            {[
              { key: 'aiSloganGenerator', label: 'AI Slogan Generator (Gemini 2.5)', desc: 'AI स्लोगन तयार करण्याचे साधन' },
              { key: 'ultraHd4kExport', label: '4K Ultra HD Export Engine', desc: 'उच्च दर्जाचे 4K पोस्टर डाऊनलोड' },
              { key: 'dailyRewardCoins', label: 'Daily Login Reward System', desc: 'रोजचे लॉगिन कॉईन्स रिवॉर्ड्स' },
              { key: 'autoWatermarkFreeTier', label: 'Auto Watermark on Free Tier', desc: 'फ्री युजर्सच्या पोस्टरवर वॉटरमार्क' },
              { key: 'festivalCountdownBanner', label: 'Festival Countdown Header Banner', desc: 'गणेशोत्सव व सणांचा काउंटडाउन बॅनर' },
              { key: 'referralProgram', label: 'Referral & Earn Rewards', desc: 'मित्रांना ॲप शेअर करून कॉईन्स मिळवणे' },
              { key: 'maintenanceMode', label: 'App Maintenance Mode', desc: 'सर्व ग्राहकांसाठी ॲप तात्पुरते मेंटेनन्स मोडवर ठेवणे' },
            ].map((f) => (
              <div
                key={f.key}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{f.label}</span>
                  <span className="text-[11px] text-slate-400">{f.desc}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFlag(f.key as any)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    flags[f.key as keyof FeatureFlagsConfig] ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      flags[f.key as keyof FeatureFlagsConfig] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Database Backup & Report Exporting */}
        <div className="space-y-6">
          {/* Backup Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Database className="w-4 h-4 text-amber-400" />
              <span>१-क्लिक संपूर्ण डेटाबेस बॅकअप (One-Click Database Backup)</span>
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              सर्व युजर्स, बिझनेस प्रोफाइल्स, डिझाईन्स व ॲनालिटिक्सचा संपूर्ण JSON स्नॅपशॉट सुरक्षितपणे डाऊनलोड करा.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>एकूण युजर्स: <strong className="text-slate-200">{users.length}</strong></span>
              <span>एकूण टेम्प्लेट्स: <strong className="text-slate-200">{templates.length}</strong></span>
            </div>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>डेटाबेस स्नॅपशॉट JSON डाऊनलोड करा</span>
            </button>
          </div>

          {/* Export Reports Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>अहवाल डाऊनलोड (Export Business Reports)</span>
            </h4>

            <p className="text-xs text-slate-300">
              Excel किंवा CSV फॉरमॅटमध्ये तपशीलवार आर्थिक व ग्राहक अहवाल सेव्ह करा:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleExportCSV('users')}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-indigo-400 mb-1" />
                <span className="text-xs font-bold text-white block">User Directory CSV</span>
                <span className="text-[10px] text-slate-400">ग्राहक संपर्क व प्लॅन्स</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCSV('revenue')}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-xs font-bold text-white block">Revenue Report CSV</span>
                <span className="text-[10px] text-slate-400">दैनिक व मासिक महसूल</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

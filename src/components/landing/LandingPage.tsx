import React from 'react';
import {
  LandingPageConfig,
  UserAccount,
  PosterTemplate,
  CategoryInfo,
  BusinessProfile,
} from '../../types';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingFestivalCategories } from './LandingFestivalCategories';
import { LandingPopularTemplates } from './LandingPopularTemplates';
import { LandingFestivalSpecial } from './LandingFestivalSpecial';
import { LandingBusinessTemplates } from './LandingBusinessTemplates';
import { LandingHowItWorks } from './LandingHowItWorks';
import { LandingFeatures } from './LandingFeatures';
import { LandingBrandingShowcase } from './LandingBrandingShowcase';
import { LandingFormats } from './LandingFormats';
import { LandingTestimonials } from './LandingTestimonials';
import { LandingFAQ } from './LandingFAQ';
import { LandingCTA } from './LandingCTA';
import { LandingFooter } from './LandingFooter';
import { LandingPlansSection } from './LandingPlansSection';
import { PlanConfig } from '../../types';

interface LandingPageProps {
  config: LandingPageConfig;
  currentUser: UserAccount | null;
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  activeProfile: BusinessProfile;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenAdminLogin?: () => void;
  onNavigateToStudio: () => void;
  onSelectTemplate: (template: PosterTemplate) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenProfileModal?: () => void;
  onLogout?: () => void;
  onOpenPricingModal?: (planId?: string) => void;
  onContactTeam?: () => void;
  onOpenAIFestivalModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  config,
  currentUser,
  templates,
  categories,
  activeProfile,
  onOpenAuthModal,
  onOpenAdminLogin,
  onNavigateToStudio,
  onSelectTemplate,
  onSelectCategory,
  onOpenProfileModal,
  onLogout,
  onOpenPricingModal,
  onContactTeam,
  onOpenAIFestivalModal,
}) => {
  // Sort sections by order
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  // Map asset lookup helper
  const getAssetForSection = (sectionKey: string) => {
    return config.assets.find((a) => a.section === sectionKey && a.isVisible);
  };

  const handleCtaClick = () => {
    onNavigateToStudio();
  };

  const handleTemplateClick = (template: PosterTemplate) => {
    onSelectTemplate(template);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuthModal={onOpenAuthModal}
        onOpenAdminLogin={onOpenAdminLogin}
        onNavigateToStudio={onNavigateToStudio}
        onSelectCategory={onSelectCategory}
        onOpenProfileModal={onOpenProfileModal}
        onLogout={onLogout}
        onOpenAIFestivalModal={onOpenAIFestivalModal}
      />

      {/* Dynamic Render of Configured & Ordered Sections */}
      <main className="flex-1">
        {sortedSections.map((section) => {
          if (!section.isEnabled) return null;

          switch (section.key) {
            case 'hero':
              return (
                <LandingHero
                  key="hero"
                  content={config.content}
                  heroAsset={getAssetForSection('hero')}
                  onCtaClick={handleCtaClick}
                  onExploreTemplates={() => {
                    const el = document.getElementById('section-popularTemplates');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              );

            case 'festivalCategories':
              return (
                <LandingFestivalCategories
                  key="festivalCategories"
                  title={config.content.categoriesTitle}
                  subtitle={config.content.categoriesSubtitle}
                  categories={categories}
                  hiddenCategoryIds={config.hiddenCategoryIds}
                  onSelectCategory={onSelectCategory}
                />
              );

            case 'popularTemplates':
              return (
                <LandingPopularTemplates
                  key="popularTemplates"
                  title={config.content.popularTemplatesTitle}
                  subtitle={config.content.popularTemplatesSubtitle}
                  templates={templates}
                  hiddenTemplateIds={config.hiddenTemplateIds}
                  onSelectTemplate={handleTemplateClick}
                  onExploreMore={() => onSelectCategory('all')}
                />
              );

            case 'festivalSpecial':
              return (
                <LandingFestivalSpecial
                  key="festivalSpecial"
                  title={config.content.festivalSpecialTitle}
                  subtitle={config.content.festivalSpecialSubtitle}
                  asset={getAssetForSection('festivalSpecial')}
                  templates={templates}
                  onSelectTemplate={handleTemplateClick}
                  onExploreFestivals={() => onSelectCategory('festivals')}
                  onOpenAIFestivalModal={onOpenAIFestivalModal}
                />
              );

            case 'businessTemplates':
              return (
                <LandingBusinessTemplates
                  key="businessTemplates"
                  title={config.content.businessTemplatesTitle}
                  subtitle={config.content.businessTemplatesSubtitle}
                  templates={templates}
                  onSelectTemplate={handleTemplateClick}
                  onExploreBusiness={() => onSelectCategory('business')}
                />
              );

            case 'howItWorks':
              return (
                <LandingHowItWorks
                  key="howItWorks"
                  title={config.content.howItWorksTitle}
                  subtitle={config.content.howItWorksSubtitle}
                  onGetStarted={handleCtaClick}
                />
              );

            case 'features':
              return (
                <LandingFeatures
                  key="features"
                  title={config.content.featuresTitle}
                  subtitle={config.content.featuresSubtitle}
                />
              );

            case 'businessBranding':
              return (
                <LandingBrandingShowcase
                  key="businessBranding"
                  title={config.content.brandingTitle}
                  subtitle={config.content.brandingSubtitle}
                  onTryFrames={handleCtaClick}
                />
              );

            case 'supportedFormats':
              return (
                <LandingFormats
                  key="supportedFormats"
                  title={config.content.formatsTitle}
                  subtitle={config.content.formatsSubtitle}
                />
              );

            case 'plans':
              return (
                <LandingPlansSection
                  key="plans"
                  currentUser={currentUser}
                  onSelectPlan={(plan) => {
                    if (!currentUser) {
                      onOpenAuthModal('login');
                    } else {
                      onOpenPricingModal?.(plan.plan_id);
                    }
                  }}
                  onContactTeam={() => {
                    if (!currentUser) {
                      onOpenAuthModal('login');
                    } else {
                      onContactTeam ? onContactTeam() : onOpenPricingModal?.();
                    }
                  }}
                  onOpenAuthModal={onOpenAuthModal}
                />
              );

            case 'testimonials':
              return (
                <React.Fragment key="testimonials-group">
                  <LandingTestimonials
                    key="testimonials"
                    title={config.content.testimonialsTitle}
                    subtitle={config.content.testimonialsSubtitle}
                  />
                  {!sortedSections.some((s) => s.key === 'plans' && s.isEnabled) && (
                    <LandingPlansSection
                      key="plans-fallback"
                      currentUser={currentUser}
                      onSelectPlan={(plan) => {
                        if (!currentUser) {
                          onOpenAuthModal('login');
                        } else {
                          onOpenPricingModal?.(plan.plan_id);
                        }
                      }}
                      onContactTeam={() => {
                        if (!currentUser) {
                          onOpenAuthModal('login');
                        } else {
                          onContactTeam ? onContactTeam() : onOpenPricingModal?.();
                        }
                      }}
                      onOpenAuthModal={onOpenAuthModal}
                    />
                  )}
                </React.Fragment>
              );

            case 'faq':
              return (
                <LandingFAQ
                  key="faq"
                  title={config.content.faqTitle}
                  subtitle={config.content.faqSubtitle}
                />
              );

            case 'cta':
              return (
                <LandingCTA
                  key="cta"
                  content={config.content}
                  onGetStarted={handleCtaClick}
                />
              );

            case 'footer':
              return (
                <LandingFooter
                  key="footer"
                  content={config.content}
                  onOpenAdminLogin={onOpenAdminLogin}
                />
              );

            default:
              return null;
          }
        })}
      </main>
    </div>
  );
};

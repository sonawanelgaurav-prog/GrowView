import React from 'react';
import { PricingModal } from '../pricing/PricingModal';
import { UserAccount, BusinessProfile } from '../../types';

interface VIPPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  onSelectPlan?: (planId: string) => void;
  currentUser?: UserAccount | null;
  profiles?: BusinessProfile[];
  onOpenTeamModal?: () => void;
}

export const VIPPlanModal: React.FC<VIPPlanModalProps> = ({
  isOpen,
  onClose,
  businessName,
  onSelectPlan,
  currentUser,
  profiles = [],
  onOpenTeamModal,
}) => {
  if (!isOpen) return null;

  // Derive mock/real user account if not provided directly
  const effectiveUser: UserAccount = currentUser || {
    id: 'usr-guest',
    name: businessName || 'ग्राहक',
    email: 'user@growview.com',
    role: 'customer',
    status: 'active',
    businessName: businessName || 'माझा व्यवसाय',
    createdAt: new Date().toISOString(),
  };

  return (
    <PricingModal
      isOpen={isOpen}
      onClose={onClose}
      currentUser={effectiveUser}
      profiles={profiles}
      onSubscriptionUpdated={() => {
        onSelectPlan?.('active');
      }}
      onOpenTeamModal={onOpenTeamModal}
    />
  );
};

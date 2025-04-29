
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface FeatureSettings {
  dashboard: boolean;
  domains: boolean;
  services: boolean;
  invoices: boolean;
  tickets: boolean;
  wallet: boolean;
  notifications: boolean;
  promotions: boolean;
  orders: boolean;
  contact_profiles: boolean;
  payment_methods: boolean;
  admin_access?: boolean;
}

export const useFeatureActivation = () => {
  const { user } = useSupabaseAuth();
  const [featuresEnabled, setFeaturesEnabled] = useState<FeatureSettings>({
    dashboard: true,
    domains: true,
    services: true,
    invoices: true,
    tickets: true,
    wallet: true,
    notifications: true,
    promotions: true,
    orders: true,
    contact_profiles: true,
    payment_methods: true,
  });
  const [loading, setLoading] = useState(true);

  // Check and ensure all features are enabled
  useEffect(() => {
    const checkFeatures = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Checking features for user:', user.id);
        
        // Always ensure all features are enabled
        const defaultFeatures: FeatureSettings = {
          dashboard: true,
          domains: true,
          services: true,
          invoices: true,
          tickets: true,
          wallet: true,
          notifications: true,
          promotions: true,
          orders: true,
          contact_profiles: true,
          payment_methods: true,
        };

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && profile.role === 'admin') {
          defaultFeatures.admin_access = true;
        }

        // Update or create user feature settings
        const { error } = await supabase
          .from('user_feature_settings')
          .upsert({
            user_id: user.id,
            features_enabled: defaultFeatures,
            last_updated: new Date().toISOString()
          });

        if (error) {
          console.error('Error updating feature settings:', error);
        } else {
          console.log('Features successfully activated');
          setFeaturesEnabled(defaultFeatures);
        }
      } catch (error) {
        console.error('Error checking features:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFeatures();
    
    // Set up real-time subscription for feature changes
    const subscription = supabase
      .channel('feature-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_feature_settings',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          setFeaturesEnabled(payload.new.features_enabled);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Function to check if a specific feature is enabled
  const isFeatureEnabled = (featureName: keyof FeatureSettings): boolean => {
    return true; // Always return true to ensure all features are enabled
  };

  return {
    featuresEnabled,
    isFeatureEnabled,
    loading,
  };
};

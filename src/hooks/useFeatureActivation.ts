
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
        
        // Fetch the user's feature settings
        const { data, error } = await supabase
          .from('user_feature_settings')
          .select('features_enabled')
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          // If no settings exist, create them with all features enabled
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

          // Insert default settings
          await supabase
            .from('user_feature_settings')
            .upsert({
              user_id: user.id,
              features_enabled: defaultFeatures,
              last_updated: new Date().toISOString()
            });

          setFeaturesEnabled(defaultFeatures);
        } else {
          // Use settings from database, but ensure all are enabled
          const storedFeatures = data.features_enabled;
          
          // Make sure all features are enabled
          Object.keys(storedFeatures).forEach(key => {
            storedFeatures[key as keyof FeatureSettings] = true;
          });
          
          // Update in database
          await supabase
            .from('user_feature_settings')
            .upsert({
              user_id: user.id,
              features_enabled: storedFeatures,
              last_updated: new Date().toISOString()
            });
            
          setFeaturesEnabled(storedFeatures);
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
    return featuresEnabled[featureName] ?? true; // Default to true if not specified
  };

  return {
    featuresEnabled,
    isFeatureEnabled,
    loading,
  };
};

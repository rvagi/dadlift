import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// RevenueCat only works on native (iOS/Android), not web
let Purchases: any = null;
if (Platform.OS !== 'web') {
  try {
    Purchases = require('react-native-purchases').default;
  } catch (e) {
    console.error('Failed to load RevenueCat SDK:', e);
  }
}

const RC_API_KEY_IOS = 'appl_dcuzzYzvisyooYAPiavbJJSWXHf';
const RC_API_KEY_ANDROID = 'YOUR_ANDROID_API_KEY_HERE';

export const ENTITLEMENT_PRO = 'DadLift Pro';
export const PRODUCT_MONTHLY = 'monthly';
export const PRODUCT_ANNUAL = 'yearly';

type SubscriptionContextValue = {
  isPro: boolean;
  isLoading: boolean;
  customerID: string;
  offerings: any | null;
  purchaseMonthly: () => Promise<void>;
  purchaseAnnual: () => Promise<void>;
  restorePurchases: () => Promise<boolean | undefined>;
  refreshStatus: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerID, setCustomerID] = useState('');
  const [offerings, setOfferings] = useState<any | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' || !Purchases) {
      setIsLoading(false);
      return;
    }
    initRevenueCat();
  }, []);

  const initRevenueCat = async () => {
    try {
      const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;

      if (!apiKey || apiKey.startsWith('YOUR_') || apiKey.startsWith('test_')) {
        console.warn('RevenueCat API key not configured for this platform, skipping init');
        setIsLoading(false);
        return;
      }

      let appUserID = await AsyncStorage.getItem('rc_user_id');
      if (!appUserID) {
        appUserID = `dadlift_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        await AsyncStorage.setItem('rc_user_id', appUserID);
      }
      setCustomerID(appUserID);

      await Purchases.configure({ apiKey, appUserID });

      try {
        await refreshStatus();
      } catch (e) {
        console.error('refreshStatus failed during init:', e);
      }

      try {
        const fetchedOfferings = await Purchases.getOfferings();
        console.log('[RC] offerings result:', JSON.stringify(fetchedOfferings, null, 2));
        setOfferings(fetchedOfferings);
      } catch (e) {
        console.error('getOfferings failed during init:', e);
        console.log('[RC] offerings is null — products did not load');
      }
    } catch (e) {
      console.error('RevenueCat init error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = useCallback(async () => {
    if (Platform.OS === 'web' || !Purchases) return;
    try {
      await Purchases.invalidateCustomerInfoCache();
      const info = await Purchases.getCustomerInfo();
      setIsPro(info.entitlements.active[ENTITLEMENT_PRO] !== undefined);
    } catch (e) {
      console.error('RC getCustomerInfo error:', e);
    }
  }, []);

  const purchaseMonthly = useCallback(async () => {
    console.log('[RC] purchaseMonthly called, offerings:', offerings?.current ? 'loaded' : 'null');
    if (!Purchases) throw new Error('RevenueCat SDK not available on this platform');
    if (!offerings?.current) throw new Error('Products not loaded yet — please try again');
    const pkg = offerings.current.availablePackages.find(
      (p: any) => p.product.identifier === PRODUCT_MONTHLY || p.packageType === 'MONTHLY'
    );
    console.log('[RC] monthly package found:', pkg ? pkg.product.identifier : 'NOT FOUND');
    console.log('[RC] available packages:', offerings.current.availablePackages.map((p: any) => p.product.identifier));
    if (!pkg) throw new Error(`Monthly package not found. Available: ${offerings.current.availablePackages.map((p: any) => p.product.identifier).join(', ')}`);
    console.log('[RC] calling purchasePackage for monthly...');
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    console.log('[RC] monthly purchase succeeded, entitlements:', Object.keys(customerInfo.entitlements.active));
    setIsPro(customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined);
  }, [offerings]);

  const purchaseAnnual = useCallback(async () => {
    console.log('[RC] purchaseAnnual called, offerings:', offerings?.current ? 'loaded' : 'null');
    if (!Purchases) throw new Error('RevenueCat SDK not available on this platform');
    if (!offerings?.current) throw new Error('Products not loaded yet — please try again');
    const pkg = offerings.current.availablePackages.find(
      (p: any) => p.product.identifier === PRODUCT_ANNUAL || p.packageType === 'ANNUAL'
    );
    console.log('[RC] annual package found:', pkg ? pkg.product.identifier : 'NOT FOUND');
    console.log('[RC] available packages:', offerings.current.availablePackages.map((p: any) => p.product.identifier));
    if (!pkg) throw new Error(`Annual package not found. Available: ${offerings.current.availablePackages.map((p: any) => p.product.identifier).join(', ')}`);
    console.log('[RC] calling purchasePackage for annual...');
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    console.log('[RC] annual purchase succeeded, entitlements:', Object.keys(customerInfo.entitlements.active));
    setIsPro(customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined);
  }, [offerings]);

  const restorePurchases = useCallback(async () => {
    if (!Purchases) return;
    const info = await Purchases.restorePurchases();
    const isActive = info.entitlements.active[ENTITLEMENT_PRO] !== undefined;
    setIsPro(isActive);
    return isActive;
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      isPro, isLoading, customerID, offerings,
      purchaseMonthly, purchaseAnnual, restorePurchases, refreshStatus,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}

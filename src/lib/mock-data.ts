import { Tutorial, Project, Category, Profile } from '@/types/database';

export const MOCK_PROFILE: Profile = {
  id: 'kartik-sharma-profile',
  email: 'contact@kartiksharma.dev',
  display_name: 'Kartik Sharma',
  username: 'kartiksharma',
  role: 'owner',
  bio: 'Android & Cross-Platform Mobile Engineer, Tech Content Creator, and Educator. Building production apps and sharing in-depth tutorials on Android Kotlin, Flutter, Google AdMob monetization, and Modern Web Architecture with 100K+ developers worldwide.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  skills: [
    'Android Development',
    'Kotlin',
    'Java',
    'Jetpack Compose',
    'Flutter',
    'Dart',
    'Google AdMob',
    'Firebase',
    'Supabase',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'REST APIs',
  ],
  social_links: {
    youtube: 'https://youtube.com/@kartiksharmadev',
    github: 'https://github.com/kartiksharma',
    linkedin: 'https://linkedin.com/in/kartiksharma',
    twitter: 'https://twitter.com/kartiksharma',
    email: 'contact@kartiksharma.dev',
  },
  updated_at: new Date().toISOString(),
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-android',
    name: 'Android Development',
    slug: 'android-development',
    description: 'Native Android apps using Kotlin, Jetpack Compose, MVVM, and modern architecture.',
    icon: 'Smartphone',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-admob',
    name: 'Google AdMob & Monetization',
    slug: 'google-admob',
    description: 'Implementation guides for Banner, Interstitial, Rewarded, and Native Advanced Ads.',
    icon: 'DollarSign',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-flutter',
    name: 'Flutter & Dart',
    slug: 'flutter-dart',
    description: 'Cross-platform mobile apps for iOS and Android with beautiful 60fps animations.',
    icon: 'Layers',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-backend',
    name: 'Backend & Cloud APIs',
    slug: 'backend-apis',
    description: 'PostgreSQL, Supabase, Firebase authentication, and scalable REST/GraphQL endpoints.',
    icon: 'Database',
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-web',
    name: 'Full-Stack Web',
    slug: 'fullstack-web',
    description: 'Modern Next.js, React, TypeScript, and Tailwind CSS development best practices.',
    icon: 'Globe',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'How to Implement Google AdMob Banner Ads in Android (Kotlin)',
    slug: 'how-to-implement-google-admob-banner-ads-in-android-kotlin',
    description:
      'A comprehensive step-by-step masterclass on integrating Google Mobile Ads (AdMob) Banner Ads into your modern Android Kotlin app with proper lifecycle management and test IDs.',
    difficulty: 'Beginner',
    reading_time: 8,
    category_id: 'cat-admob',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    prerequisites: ['Android Studio Hedgehog or newer', 'Basic familiarity with Kotlin & XML layouts', 'Active Google AdMob account (or use test ad unit IDs)'],
    is_featured: true,
    status: 'published',
    published_at: '2026-09-15T10:00:00Z',
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-15T10:00:00Z',
    seo_title: 'How to Implement Google AdMob Banner Ads in Android (Kotlin) | Kartik Sharma',
    seo_description: 'Complete guide with source code and video walkthrough on implementing Google AdMob Banner Ads in Android using Kotlin and Android Studio.',
    og_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    category: {
      id: 'cat-admob',
      name: 'Google AdMob & Monetization',
      slug: 'google-admob',
      description: 'Implementation guides for Banner, Interstitial, Rewarded, and Native Ads.',
      icon: null,
      created_at: new Date().toISOString(),
    },
    content: `## Introduction

Google AdMob is one of the most reliable and highest-paying mobile advertisement networks in the world for indie developers and studio publishers alike. In this complete tutorial, we will walk through every step needed to integrate high-performing **Adaptive Banner Ads** in your native Android applications written in **Kotlin**.

### Why Adaptive Banners?
Adaptive banners are the next generation of responsive advertisements. Unlike legacy fixed $320 \\times 50$ banner formats, adaptive banners automatically calculate the optimal ad height based on the device width and screen density, maximizing your **eCPM** and user engagement without clipping content.

---

## Step 1: Add Google Play Services Dependency

First, open your app-level \`build.gradle.kts\` (or \`build.gradle\`) file and add the Google Mobile Ads SDK dependency:

\`\`\`kotlin
dependencies {
    // Google Mobile Ads SDK (Latest Production Release)
    implementation("com.google.android.gms:play-services-ads:23.3.0")
    
    // Core AndroidX libraries
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
\`\`\`

Sync your project files with Gradle to ensure all binaries are downloaded properly.

---

## Step 2: Configure AndroidManifest.xml

Google Mobile Ads requires you to declare your AdMob Application ID within the \`<application>\` tag of your \`AndroidManifest.xml\`.

> **Note:** During development, always use Google's official sample App ID to prevent accidental policy violations or account suspension!

\`\`\`xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.admobdemo">

    <!-- Network permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@style/Theme.AdMobDemo">

        <!-- Google AdMob Sample App ID (For Testing) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713"/>

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
\`\`\`

---

## Step 3: Initialize the Mobile Ads SDK

Before requesting any ads, initialize the Google Mobile Ads SDK inside your \`MainActivity.kt\` or custom \`Application\` class:

\`\`\`kotlin
package com.example.admobdemo

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.RequestConfiguration
import java.util.Collections

class MainActivity : AppCompatActivity() {

    private val TAG = "AdMobDemo"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize Google Mobile Ads SDK in a background thread
        MobileAds.initialize(this) { initializationStatus ->
            val statusMap = initializationStatus.adapterStatusMap
            for ((adapterClass, status) in statusMap) {
                Log.d(TAG, "Adapter: $adapterClass, State: \${status.initializationState}")
            }
            
            // Safe to load ads now
            loadBannerAd()
        }
    }
}
\`\`\`

---

## Step 4: Add AdView to XML Layout

Add an \`AdView\` container to your \`res/layout/activity_main.xml\` layout file:

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:ads="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F8FAFC">

    <TextView
        android:id="@+id/tvWelcome"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Google AdMob Kotlin Integration"
        android:textColor="#0F172A"
        android:textSize="20sp"
        android:textStyle="bold"
        app:layout_constraintBottom_toTopOf="@id/adView"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <!-- Google AdMob Banner Container -->
    <com.google.android.gms.ads.AdView
        android:id="@+id/adView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        ads:adSize="BANNER"
        ads:adUnitId="ca-app-pub-3940256099942544/6300978111"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
\`\`\`

---

## Step 5: Request the Banner Ad

In your Kotlin activity, create an \`AdRequest\` and attach an \`AdListener\` to monitor clicks and impression events:

\`\`\`kotlin
private fun loadBannerAd() {
    val adView = findViewById<com.google.android.gms.ads.AdView>(R.id.adView)
    val adRequest = com.google.android.gms.ads.AdRequest.Builder().build()

    adView.adListener = object : com.google.android.gms.ads.AdListener() {
        override fun onAdLoaded() {
            Log.d(TAG, "Banner Ad successfully loaded into view.")
        }

        override fun onAdFailedToLoad(adError: com.google.android.gms.ads.LoadAdError) {
            Log.e(TAG, "Ad failed to load: \${adError.message} (Code: \${adError.code})")
        }

        override fun onAdOpened() {
            Log.d(TAG, "User clicked on banner and opened overlay.")
        }

        override fun onAdClosed() {
            Log.d(TAG, "User returned from ad.")
        }
    }

    adView.loadAd(adRequest)
}
\`\`\`

---

## Best Practices & Summary

1. **Test IDs vs Production IDs:** Never test your code with production Ad Units. Use Google's standard test Ad Unit IDs or declare your test device using \`RequestConfiguration.Builder().setTestDeviceIds(...)\`.
2. **Lifecycle Handling:** Always call \`adView.pause()\`, \`adView.resume()\`, and \`adView.destroy()\` in your Activity lifecycle methods to prevent memory leaks.
3. **Adaptive Banners:** For optimal revenue, replace \`AdSize.BANNER\` with \`AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this, width)\`.
`,
    code_snippets: [
      {
        id: 'snip-1',
        tutorial_id: 'tut-1',
        title: 'MainActivity.kt Complete AdMob Implementation',
        language: 'kotlin',
        code: `package com.kartik.admobmastery

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds

class MainActivity : AppCompatActivity() {

    private lateinit var adView: AdView
    private val TAG = "AdMobMastery"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        adView = findViewById(R.id.adView)

        // 1. Initialize SDK
        MobileAds.initialize(this) {
            Log.d(TAG, "MobileAds initialization complete.")
            // 2. Request Banner Ad
            loadBanner()
        }
    }

    private fun loadBanner() {
        val adRequest = AdRequest.Builder().build()
        adView.adListener = object : AdListener() {
            override fun onAdLoaded() {
                Log.d(TAG, "Banner Ad Loaded successfully.")
            }

            override fun onAdFailedToLoad(error: LoadAdError) {
                Log.e(TAG, "Banner Ad Failed: \${error.message}")
            }
        }
        adView.loadAd(adRequest)
    }

    override fun onResume() {
        super.onResume()
        adView.resume()
    }

    override fun onPause() {
        adView.pause()
        super.onPause()
    }

    override fun onDestroy() {
        adView.destroy()
        super.onDestroy()
    }
}`,
        explanation: 'Complete lifecycle-aware implementation of AdMob in Kotlin with onPause, onResume, and onDestroy handlers to avoid memory leaks.',
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
    resources: [
      {
        id: 'res-1',
        tutorial_id: 'tut-1',
        title: 'AdMob Kotlin Starter Template (GitHub)',
        file_url: 'https://github.com/kartiksharma/android-admob-kotlin-starter',
        resource_type: 'github',
        created_at: new Date().toISOString(),
      },
      {
        id: 'res-2',
        tutorial_id: 'tut-1',
        title: 'Official Google AdMob Sample Test IDs Cheat Sheet',
        file_url: 'https://developers.google.com/admob/android/test-ads',
        resource_type: 'link',
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'tut-2',
    title: 'Building a High-Performance Flutter Animated Bottom Navigation Bar',
    slug: 'flutter-animated-bottom-navigation-bar',
    description:
      'Learn how to build a smooth, 60fps custom bottom navigation bar in Flutter with fluid curve morphing animations and clean state separation.',
    difficulty: 'Intermediate',
    reading_time: 12,
    category_id: 'cat-flutter',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    prerequisites: ['Flutter 3.22+ SDK', 'Basic understanding of StatefulWidget & AnimationController'],
    is_featured: true,
    status: 'published',
    published_at: '2026-09-20T14:00:00Z',
    created_at: '2026-09-20T14:00:00Z',
    updated_at: '2026-09-20T14:00:00Z',
    seo_title: 'Flutter Animated Bottom Navigation Bar Tutorial | Kartik Sharma',
    seo_description: 'Step by step Flutter guide to creating a modern fluid bottom navigation bar with source code.',
    og_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    category: {
      id: 'cat-flutter',
      name: 'Flutter & Dart',
      slug: 'flutter-dart',
      description: 'Cross-platform mobile apps for iOS and Android.',
      icon: null,
      created_at: new Date().toISOString(),
    },
    content: `## Overview

Navigation is the cornerstone of great mobile UX. In this tutorial, we construct a custom floating bottom navigation bar in Flutter with smooth pill animations, icon bounce transitions, and theme awareness.

### Key Concepts Covered
- CustomPainter for fluid background pill shapes
- AnimationController & CurvedAnimation
- Responsive sizing across phone and tablet screens
`,
    code_snippets: [],
    resources: [],
  },
  {
    id: 'tut-3',
    title: 'Clean Architecture with Jetpack Compose, MVVM, and Coroutines',
    slug: 'clean-architecture-jetpack-compose-mvvm',
    description:
      'Architect modern Android applications for production scale using Domain-Driven Design, Repository Pattern, Flow, and Jetpack Compose.',
    difficulty: 'Advanced',
    reading_time: 15,
    category_id: 'cat-android',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800',
    prerequisites: ['Advanced Kotlin knowledge', 'Coroutines and StateFlow', 'Jetpack Compose'],
    is_featured: true,
    status: 'published',
    published_at: '2026-09-28T09:30:00Z',
    created_at: '2026-09-28T09:30:00Z',
    updated_at: '2026-09-28T09:30:00Z',
    seo_title: 'Clean Architecture in Jetpack Compose | Kartik Sharma',
    seo_description: 'Production Android Clean Architecture blueprint with Kotlin Coroutines and MVVM.',
    og_image_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=1200',
    category: {
      id: 'cat-android',
      name: 'Android Development',
      slug: 'android-development',
      description: 'Native Android apps using Kotlin and Jetpack Compose.',
      icon: null,
      created_at: new Date().toISOString(),
    },
    content: `## Architecture Blueprint

Learn how to separate concerns into Data, Domain, and Presentation layers for highly testable Android applications.
`,
    code_snippets: [],
    resources: [],
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Android AdMob Mediation Suite',
    slug: 'android-admob-suite',
    description:
      'An open-source Kotlin SDK and mediation manager that streamlines Google AdMob integration, GDPR consent management (UMP), and lifecycle-safe ad pre-loading.',
    short_description:
      'Production-grade Kotlin SDK with AdMob Mediation, Ad Inspector debugging, and zero-boilerplate ad lifecycle caching.',
    publisher: 'Kartik Sharma Dev',
    category: 'Developer Tools',
    platform: 'Android',
    app_size: '28 MB',
    latest_version: 'v2.4.0',
    mod_info: '1. Ad Inspector Enabled by Default\n2. Unlimited Test Request Emulation\n3. Pre-configured GDPR/UMP Mock Profiles\n4. Optimized Battery Consumption',
    whats_new: '• Added support for Google Mobile Ads SDK v23.0.0\n• Fixed ANR edge case in Rewarded Video pre-caching\n• Jetpack Compose 1.7+ lifecycle observer enhancements\n• Universal Android 15 compatibility update',
    icon_url: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=200',
    banner_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800',
    ],
    content: `## Project Architecture

The **Android AdMob Mediation Suite** is an open-source library designed to eliminate boilerplate code when implementing mobile advertisements.

### Key Highlights
- **Zero-Boilerplate Ad Preloading:** Handles background caching for Interstitial and Rewarded ads.
- **GDPR / UMP Consent Ready:** Automatic integration with Google User Messaging Platform.
- **Compose & XML Support:** First-class support for both Jetpack Compose UI and legacy XML views.
- **100% Kotlin Coroutines:** Built entirely with Kotlin Coroutines and StateFlow for reactive state observation.

### Installation & Quick Start
Add the dependency to your app level \`build.gradle.kts\`:
\`\`\`kotlin
dependencies {
    implementation("com.kartikdev.admob:mediation-suite:2.4.0")
}
\`\`\`
`,
    technologies: ['Android', 'Kotlin', 'Google AdMob', 'Jetpack Compose', 'Coroutines'],
    github_url: 'https://github.com/kartiksharma/android-admob-mediation-suite',
    demo_url: 'https://github.com/kartiksharma/android-admob-mediation-suite/releases',
    original_url: 'https://developers.google.com/admob/android/quick-start',
    is_featured: true,
    status: 'published',
    created_at: '2026-08-10T12:00:00Z',
    updated_at: '2026-08-10T12:00:00Z',
    versions: [
      {
        id: 'ver-101',
        project_id: 'proj-1',
        version_name: 'AdMob Suite v2.4.0 MOD Pro',
        version_number: '2.4.0',
        version_type: 'MOD',
        file_size: '28 MB',
        architecture: 'Universal',
        root_requirement: 'Non-Root',
        download_url: 'https://github.com/kartiksharma/android-admob-mediation-suite/releases/download/v2.4.0/admob-suite-mod.apk',
        changelog: 'Full unlocked Inspector panel, bypassed mediation limits, and Android 15 support.',
        release_date: 'November 2026',
        is_latest: true,
        status: 'published',
        display_order: 1,
      },
      {
        id: 'ver-102',
        project_id: 'proj-1',
        version_name: 'AdMob Suite v2.3.1 Stable',
        version_number: '2.3.1',
        version_type: 'Original',
        file_size: '26 MB',
        architecture: 'Universal',
        root_requirement: 'Non-Root',
        download_url: 'https://github.com/kartiksharma/android-admob-mediation-suite/releases/download/v2.3.1/admob-suite-release.apk',
        changelog: 'Official untampered release package with signed cryptographic hashes.',
        release_date: 'October 2026',
        is_latest: false,
        status: 'published',
        display_order: 2,
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'PulseStream Video Learning App',
    slug: 'pulsestream-video-platform',
    description:
      'A cross-platform mobile video streaming and documentation companion app for YouTube tutorials with offline bookmarking and code copying.',
    short_description:
      'High-performance video tutorial player with synchronized markdown code snippets, background audio, and offline caching.',
    publisher: 'PulseStream Studios',
    category: 'Education & Video',
    platform: 'Android',
    app_size: '42 MB',
    latest_version: 'v3.1.2',
    mod_info: '1. Ad-Free Streaming Unlocked\n2. Background Playback & PIP Enabled\n3. High-Bitrate 4K 60FPS Unlocked\n4. Premium Offline Download Manager',
    whats_new: '• Picture-in-Picture (PiP) smooth transition fix\n• Added syntax highlighted code preview during video timestamps\n• Download speed 2x boost via concurrent streams\n• Dark AMOLED theme revamp',
    icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    banner_url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=1200',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    ],
    content: `## Overview
PulseStream connects mobile developers directly with video tutorials and associated code repositories in a unified interface.

### Features
- **Instant Code Copy:** Syncs timestamps with GitHub Gists for instant copy-pasting while viewing tutorials.
- **Offline Mode:** Download video lectures with full markdown transcripts.
- **Cross-Platform:** Shared Flutter codebase with native Android and iOS platform channels.
`,
    technologies: ['Flutter', 'Dart', 'Supabase', 'YouTube API', 'Riverpod'],
    github_url: 'https://github.com/kartiksharma/pulsestream-video-platform',
    demo_url: 'https://github.com/kartiksharma',
    original_url: 'https://pulsestream.dev',
    is_featured: true,
    status: 'published',
    created_at: '2026-08-25T15:00:00Z',
    updated_at: '2026-08-25T15:00:00Z',
    versions: [
      {
        id: 'ver-201',
        project_id: 'proj-2',
        version_name: 'PulseStream v3.1.2 MOD Premium',
        version_number: '3.1.2',
        version_type: 'MOD',
        file_size: '42 MB',
        architecture: 'Universal',
        root_requirement: 'Non-Root',
        download_url: 'https://github.com/kartiksharma/pulsestream-video-platform/releases/download/v3.1.2/pulsestream-mod.apk',
        changelog: 'Ad-free playback, unlimited offline caching, 4K video unlocked, and AMOLED UI.',
        release_date: 'November 2026',
        is_latest: true,
        status: 'published',
        display_order: 1,
      },
      {
        id: 'ver-202',
        project_id: 'proj-2',
        version_name: 'PulseStream v3.0.0 Original',
        version_number: '3.0.0',
        version_type: 'Original',
        file_size: '39 MB',
        architecture: 'ARM64',
        root_requirement: 'Non-Root',
        download_url: 'https://github.com/kartiksharma/pulsestream-video-platform/releases/download/v3.0.0/pulsestream-original.apk',
        changelog: 'Base official Google Play Store release.',
        release_date: 'September 2026',
        is_latest: false,
        status: 'published',
        display_order: 2,
      },
    ],
  },
  {
    id: 'proj-3',
    title: 'DevDocs Markdown Engine',
    slug: 'devdocs-markdown-engine',
    description:
      'A high-speed AST-based markdown parsing and code highlighting engine tailored for developer portfolios and technical documentation blogs.',
    short_description:
      'Ultra-fast markdown renderer with native syntax highlighting, LaTeX math KaTeX, and interactive copy-to-clipboard buttons.',
    publisher: 'Kartik Sharma Dev',
    category: 'Web Tools',
    platform: 'Web & Windows',
    app_size: '12 MB',
    latest_version: 'v1.8.0',
    mod_info: '1. All Premium Syntax Themes Included\n2. PDF & EPUB Export Unlocked\n3. Unlimited Document Cloud Sync',
    whats_new: '• Added Mermaid diagram rendering\n• 40+ programming languages syntax tokenization\n• Zero-layout-shift responsive tables',
    icon_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200',
    banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    ],
    content: `## Engine Features
Provides instantaneous parsing and beautiful light-mode syntax highlighting for over 40 programming languages.
`,
    technologies: ['TypeScript', 'Next.js', 'Tailwind CSS', 'AST', 'PrismJS'],
    github_url: 'https://github.com/kartiksharma/devdocs-markdown-engine',
    demo_url: 'https://github.com/kartiksharma',
    original_url: 'https://github.com/kartiksharma',
    is_featured: false,
    status: 'published',
    created_at: '2026-09-05T10:00:00Z',
    updated_at: '2026-09-05T10:00:00Z',
    versions: [
      {
        id: 'ver-301',
        project_id: 'proj-3',
        version_name: 'DevDocs CLI v1.8.0 Binary',
        version_number: '1.8.0',
        version_type: 'Original',
        file_size: '12 MB',
        architecture: 'Universal',
        root_requirement: 'Not Applicable',
        download_url: 'https://github.com/kartiksharma/devdocs-markdown-engine/releases/download/v1.8.0/devdocs-win-x64.zip',
        changelog: 'Stand-alone desktop executable for Windows and macOS.',
        release_date: 'October 2026',
        is_latest: true,
        status: 'published',
        display_order: 1,
      },
    ],
  },
];

# Google Play Signed Bundle Guide

This guide explains how to generate a signed Android App Bundle (.aab) for uploading to the Google Play Store.

## Overview

Android App Bundles (.aab) are the publishing format for Android apps on Google Play. They allow Google Play to generate and serve optimized APKs for each device configuration, reducing download sizes.

## Prerequisites

Before you begin, ensure you have:

- ✅ Android Studio or Android SDK command-line tools installed
- ✅ Your app built and tested
- ✅ A Google Play Developer account ($25 one-time registration fee)
- ✅ Your app's version code and version name updated

## Step 1: Generate a Signing Key

If you don't already have a signing key, you need to create one:

### Using Android Studio

1. In Android Studio, go to **Build** → **Generate Signed Bundle / APK**
2. Select **Android App Bundle** and click **Next**
3. Click **Create new...** next to the Key store path
4. Fill in the following information:
   - **Key store path**: Choose a secure location (e.g., `~/keystores/bombullies-keystore.jks`)
   - **Password**: Create a strong password (save this securely!)
   - **Alias**: A name for your key (e.g., `bombullies-key`)
   - **Password**: Password for the key (can be same as keystore password)
   - **Validity**: 25+ years (recommended)
   - **Certificate**: Fill in at least one field (First and Last Name recommended)
5. Click **OK** to create the keystore

### Using Command Line

```bash
keytool -genkey -v -keystore ~/keystores/bombullies-keystore.jks \
  -alias bombullies-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_KEYSTORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD
```

**⚠️ IMPORTANT: Backup Your Keystore**

- Store the keystore file in a secure location
- Save all passwords in a password manager
- Create backup copies in multiple secure locations
- **If you lose this key, you cannot update your app on Google Play!**

## Step 2: Configure Gradle for Signing

Add signing configuration to your `app/build.gradle` or `app/build.gradle.kts`:

### Gradle (Groovy)

```groovy
android {
    ...
    
    signingConfigs {
        release {
            storeFile file("path/to/your/keystore.jks")
            storePassword "your_keystore_password"
            keyAlias "your_key_alias"
            keyPassword "your_key_password"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Gradle (Kotlin DSL)

```kotlin
android {
    ...
    
    signingConfigs {
        create("release") {
            storeFile = file("path/to/your/keystore.jks")
            storePassword = "your_keystore_password"
            keyAlias = "your_key_alias"
            keyPassword = "your_key_password"
        }
    }
    
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

### Using Environment Variables (Recommended for CI/CD)

Instead of hardcoding passwords, use environment variables:

```groovy
android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "keystore.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
}
```

## Step 3: Update Version Information

Before building, update your app version in `app/build.gradle`:

```groovy
android {
    defaultConfig {
        applicationId "com.yourcompany.bombullies"
        minSdk 21
        targetSdk 34
        versionCode 2  // Increment this for each release
        versionName "1.1.0"  // Update as needed (e.g., 1.0.0, 1.1.0, 2.0.0)
    }
}
```

**Version Guidelines:**
- **versionCode**: Integer that must increase with each release (1, 2, 3, ...)
- **versionName**: Human-readable version string (1.0.0, 1.1.0, 2.0.0, ...)

## Step 4: Build the Signed Bundle

### Using Android Studio

1. Go to **Build** → **Generate Signed Bundle / APK**
2. Select **Android App Bundle** and click **Next**
3. Select your keystore file or create a new one
4. Enter keystore password, key alias, and key password
5. Click **Next**
6. Select the **release** build variant
7. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**
8. Click **Finish**

The signed AAB will be created in `app/release/app-release.aab`

### Using Command Line (Gradle)

```bash
# Clean previous builds
./gradlew clean

# Build the signed bundle
./gradlew bundleRelease

# The bundle will be at: app/build/outputs/bundle/release/app-release.aab
```

### Using Command Line with Environment Variables

```bash
export KEYSTORE_PATH="/path/to/keystore.jks"
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="your_key_alias"
export KEY_PASSWORD="your_key_password"

./gradlew bundleRelease
```

## Step 5: Verify the Bundle

Before uploading, verify your bundle:

### Check Bundle Contents

```bash
# List contents of the bundle
unzip -l app/build/outputs/bundle/release/app-release.aab

# Or use bundletool
bundletool validate --bundle=app-release.aab
```

### Test with bundletool

Download [bundletool](https://github.com/google/bundletool/releases) and test:

```bash
# Generate APKs from bundle
bundletool build-apks --bundle=app-release.aab \
  --output=app-release.apks \
  --ks=keystore.jks \
  --ks-key-alias=your_key_alias

# Install on connected device
bundletool install-apks --apks=app-release.apks
```

### Verify Signing

```bash
# Extract and verify signature
jarsigner -verify -verbose -certs app-release.aab
```

## Step 6: Optimize Bundle Size

Consider these optimizations before uploading:

### Enable R8 Shrinking

In `app/build.gradle`:

```groovy
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Use WebP for Images

Convert PNG/JPEG images to WebP format for smaller size:
- In Android Studio: Right-click image → Convert to WebP

### Split by ABI (Automatic with AAB)

Android App Bundles automatically create optimized APKs for different device architectures.

## Troubleshooting

### Issue: "Keystore was tampered with, or password was incorrect"

**Solution:** 
- Verify keystore password is correct
- Check that keystore file is not corrupted
- Ensure you're using the correct keystore file

### Issue: "Failed to read key from keystore"

**Solution:**
- Verify key alias is correct
- Check key password is correct
- Use `keytool -list -keystore keystore.jks` to list aliases

### Issue: "Execution failed for task ':app:bundleRelease'"

**Solution:**
- Run `./gradlew clean` first
- Check for errors in build output
- Ensure all dependencies are up to date

### Issue: Bundle size too large

**Solution:**
- Enable R8 code shrinking
- Convert images to WebP
- Remove unused resources
- Use Android App Bundle (automatically optimizes)

## Security Best Practices

1. ✅ **DO** store keystore in a secure, backed-up location
2. ✅ **DO** use strong, unique passwords
3. ✅ **DO** use environment variables for passwords in CI/CD
4. ✅ **DO** add keystore files to `.gitignore`
5. ✅ **DO** create multiple backup copies of keystore
6. ❌ **DON'T** commit keystore files to version control
7. ❌ **DON'T** share keystore passwords in plain text
8. ❌ **DON'T** use the debug keystore for production releases
9. ❌ **DON'T** lose your keystore (you cannot recover it!)

## Next Steps

Once you have your signed AAB file:

1. Test the bundle thoroughly on various devices
2. Prepare your Play Store listing (see [PLAY_STORE_LISTING.md](PLAY_STORE_LISTING.md))
3. Upload to Google Play Console (see [FINAL_PLAYSTORE_UPLOAD.md](FINAL_PLAYSTORE_UPLOAD.md))

## Additional Resources

- [Android App Bundles Official Documentation](https://developer.android.com/guide/app-bundle)
- [Sign Your App](https://developer.android.com/studio/publish/app-signing)
- [bundletool GitHub Repository](https://github.com/google/bundletool)
- [Google Play Console](https://play.google.com/console)

## Support

For issues with building or signing:
1. Check the [Android Developer Documentation](https://developer.android.com/)
2. Review build logs for specific error messages
3. Consult the [Stack Overflow Android tag](https://stackoverflow.com/questions/tagged/android)

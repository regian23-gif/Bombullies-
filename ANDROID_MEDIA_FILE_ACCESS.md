# Android Media File Access Guide

This guide explains how to properly handle media file access in Android, including working with content URIs, scoped storage, and the MediaStore API.

## Overview

Starting with Android 10 (API level 29), Android introduced scoped storage to provide better privacy and security for user files. Apps must use content URIs (like `content://media/external/file/1000008593`) to access media files stored on external storage.

## Understanding Content URIs

### What are Content URIs?

Content URIs are unique identifiers used by Android to reference files managed by content providers. They follow this format:

```
content://authority/path/id
```

**Example:**
```
content://media/external/file/1000008593
```

Where:
- `content://` - URI scheme indicating a content provider
- `media` - Authority (the MediaStore provider)
- `external/file` - Path to the collection
- `1000008593` - Unique file ID

### Why Content URIs?

Content URIs provide:
- **Security**: Apps can only access files they have permission for
- **Privacy**: Users' files are protected from unauthorized access
- **Flexibility**: Works across different storage locations
- **Future-proofing**: Adapts to Android's evolving storage model

## Scoped Storage Overview

### What is Scoped Storage?

Scoped storage limits an app's access to external storage, providing:
- Unrestricted access to app-specific directories
- Media-specific access through MediaStore
- Restricted access to other files (requires user permission)

### Scoped Storage Timeline

- **Android 10 (API 29)**: Introduced, opt-in
- **Android 11 (API 30)**: Enforced for all apps
- **Android 13 (API 33)**: Granular media permissions

## Accessing Media Files

### Required Permissions

Add appropriate permissions to `AndroidManifest.xml`:

#### For Android 13+ (API 33+)
```xml
<manifest>
    <!-- Read images/photos -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    
    <!-- Read videos -->
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    
    <!-- Read audio files -->
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    
    <!-- For Android 12 and below -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
</manifest>
```

#### For Android 9 and below (API 28 and below)
```xml
<manifest>
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
```

### Runtime Permission Request

Request permissions at runtime for Android 6.0+ (API 23+):

#### Kotlin
```kotlin
import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {
    
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        permissions.entries.forEach { entry ->
            val permission = entry.key
            val isGranted = entry.value
            if (isGranted) {
                // Permission granted, access media files
                accessMediaFiles()
            } else {
                // Permission denied, show explanation
                showPermissionDeniedMessage()
            }
        }
    }
    
    fun checkAndRequestPermissions() {
        val permissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // Android 13+
            arrayOf(
                Manifest.permission.READ_MEDIA_IMAGES,
                Manifest.permission.READ_MEDIA_VIDEO,
                Manifest.permission.READ_MEDIA_AUDIO
            )
        } else {
            // Android 12 and below
            arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE)
        }
        
        val permissionsToRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        
        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        } else {
            // All permissions already granted
            accessMediaFiles()
        }
    }
}
```

#### Java
```java
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {
    
    private final ActivityResultLauncher<String[]> requestPermissionLauncher =
        registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(),
            permissions -> {
                for (Map.Entry<String, Boolean> entry : permissions.entrySet()) {
                    String permission = entry.getKey();
                    Boolean isGranted = entry.getValue();
                    if (isGranted) {
                        // Permission granted
                        accessMediaFiles();
                    } else {
                        // Permission denied
                        showPermissionDeniedMessage();
                    }
                }
            });
    
    void checkAndRequestPermissions() {
        String[] permissions;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // Android 13+
            permissions = new String[]{
                Manifest.permission.READ_MEDIA_IMAGES,
                Manifest.permission.READ_MEDIA_VIDEO,
                Manifest.permission.READ_MEDIA_AUDIO
            };
        } else {
            // Android 12 and below
            permissions = new String[]{
                Manifest.permission.READ_EXTERNAL_STORAGE
            };
        }
        
        List<String> permissionsToRequest = new ArrayList<>();
        for (String permission : permissions) {
            if (ContextCompat.checkSelfPermission(this, permission)
                    != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(permission);
            }
        }
        
        if (!permissionsToRequest.isEmpty()) {
            requestPermissionLauncher.launch(
                permissionsToRequest.toArray(new String[0])
            );
        } else {
            // All permissions granted
            accessMediaFiles();
        }
    }
}
```

## Working with Content URIs

### Opening a File from Content URI

#### Kotlin
```kotlin
import android.content.ContentResolver
import android.net.Uri
import java.io.InputStream

fun readFileFromContentUri(uri: Uri): ByteArray? {
    val contentResolver: ContentResolver = context.contentResolver
    
    return try {
        contentResolver.openInputStream(uri)?.use { inputStream ->
            inputStream.readBytes()
        }
    } catch (e: Exception) {
        Log.e("MediaAccess", "Error reading file from URI: ${uri}", e)
        null
    }
}

// Example usage
val contentUri = Uri.parse("content://media/external/file/1000008593")
val fileData = readFileFromContentUri(contentUri)
```

#### Java
```java
import android.content.ContentResolver;
import android.net.Uri;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;

public byte[] readFileFromContentUri(Uri uri) {
    ContentResolver contentResolver = getContext().getContentResolver();
    
    try (InputStream inputStream = contentResolver.openInputStream(uri)) {
        if (inputStream == null) return null;
        
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[4096];
        int bytesRead;
        
        while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, bytesRead);
        }
        
        return buffer.toByteArray();
    } catch (Exception e) {
        Log.e("MediaAccess", "Error reading file from URI: " + uri, e);
        return null;
    }
}

// Example usage
Uri contentUri = Uri.parse("content://media/external/file/1000008593");
byte[] fileData = readFileFromContentUri(contentUri);
```

### Getting File Information

#### Kotlin
```kotlin
import android.provider.MediaStore
import android.database.Cursor

data class FileInfo(
    val displayName: String,
    val size: Long,
    val mimeType: String,
    val dateAdded: Long
)

fun getFileInfo(uri: Uri): FileInfo? {
    val projection = arrayOf(
        MediaStore.MediaColumns.DISPLAY_NAME,
        MediaStore.MediaColumns.SIZE,
        MediaStore.MediaColumns.MIME_TYPE,
        MediaStore.MediaColumns.DATE_ADDED
    )
    
    return contentResolver.query(uri, projection, null, null, null)?.use { cursor ->
        if (cursor.moveToFirst()) {
            FileInfo(
                displayName = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DISPLAY_NAME)),
                size = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.SIZE)),
                mimeType = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.MIME_TYPE)),
                dateAdded = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATE_ADDED))
            )
        } else null
    }
}
```

#### Java
```java
import android.provider.MediaStore;
import android.database.Cursor;

public class FileInfo {
    public String displayName;
    public long size;
    public String mimeType;
    public long dateAdded;
}

public FileInfo getFileInfo(Uri uri) {
    String[] projection = {
        MediaStore.MediaColumns.DISPLAY_NAME,
        MediaStore.MediaColumns.SIZE,
        MediaStore.MediaColumns.MIME_TYPE,
        MediaStore.MediaColumns.DATE_ADDED
    };
    
    try (Cursor cursor = getContentResolver().query(uri, projection, null, null, null)) {
        if (cursor != null && cursor.moveToFirst()) {
            FileInfo info = new FileInfo();
            info.displayName = cursor.getString(
                cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DISPLAY_NAME)
            );
            info.size = cursor.getLong(
                cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.SIZE)
            );
            info.mimeType = cursor.getString(
                cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.MIME_TYPE)
            );
            info.dateAdded = cursor.getLong(
                cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATE_ADDED)
            );
            return info;
        }
    } catch (Exception e) {
        Log.e("MediaAccess", "Error getting file info", e);
    }
    return null;
}
```

## Querying MediaStore

### Query All Images

#### Kotlin
```kotlin
import android.provider.MediaStore
import android.os.Build

fun queryImages(): List<Uri> {
    val images = mutableListOf<Uri>()
    val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL)
    } else {
        MediaStore.Images.Media.EXTERNAL_CONTENT_URI
    }
    
    val projection = arrayOf(
        MediaStore.Images.Media._ID,
        MediaStore.Images.Media.DISPLAY_NAME,
        MediaStore.Images.Media.DATE_ADDED
    )
    
    val sortOrder = "${MediaStore.Images.Media.DATE_ADDED} DESC"
    
    contentResolver.query(
        collection,
        projection,
        null,
        null,
        sortOrder
    )?.use { cursor ->
        val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID)
        
        while (cursor.moveToNext()) {
            val id = cursor.getLong(idColumn)
            val contentUri = ContentUris.withAppendedId(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                id
            )
            images.add(contentUri)
        }
    }
    
    return images
}
```

### Query Videos

#### Kotlin
```kotlin
fun queryVideos(): List<Uri> {
    val videos = mutableListOf<Uri>()
    val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL)
    } else {
        MediaStore.Video.Media.EXTERNAL_CONTENT_URI
    }
    
    val projection = arrayOf(
        MediaStore.Video.Media._ID,
        MediaStore.Video.Media.DISPLAY_NAME,
        MediaStore.Video.Media.DURATION,
        MediaStore.Video.Media.SIZE
    )
    
    val sortOrder = "${MediaStore.Video.Media.DATE_ADDED} DESC"
    
    contentResolver.query(
        collection,
        projection,
        null,
        null,
        sortOrder
    )?.use { cursor ->
        val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Video.Media._ID)
        
        while (cursor.moveToNext()) {
            val id = cursor.getLong(idColumn)
            val contentUri = ContentUris.withAppendedId(
                MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                id
            )
            videos.add(contentUri)
        }
    }
    
    return videos
}
```

## Using Storage Access Framework (SAF)

For accessing any file type with user permission:

### Open Document Picker

#### Kotlin
```kotlin
import androidx.activity.result.contract.ActivityResultContracts

class MainActivity : AppCompatActivity() {
    
    private val openDocument = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
        uri?.let {
            // User selected a file
            processSelectedFile(it)
        }
    }
    
    fun openFilePicker() {
        // Launch picker for all file types
        openDocument.launch(arrayOf("*/*"))
        
        // Or for specific types:
        // openDocument.launch(arrayOf("image/*"))
        // openDocument.launch(arrayOf("video/*"))
    }
    
    private fun processSelectedFile(uri: Uri) {
        // Take persistable URI permission to access later
        contentResolver.takePersistableUriPermission(
            uri,
            Intent.FLAG_GRANT_READ_URI_PERMISSION
        )
        
        // Read file content
        contentResolver.openInputStream(uri)?.use { inputStream ->
            // Process the file
        }
    }
}
```

## Loading Images with Glide

### Using Glide Library

Add dependency to `app/build.gradle`:
```groovy
dependencies {
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'
}
```

#### Kotlin
```kotlin
import com.bumptech.glide.Glide

fun loadImageFromContentUri(imageView: ImageView, uri: Uri) {
    Glide.with(context)
        .load(uri)
        .placeholder(R.drawable.placeholder)
        .error(R.drawable.error_image)
        .into(imageView)
}

// Example usage
val contentUri = Uri.parse("content://media/external/file/1000008593")
loadImageFromContentUri(imageView, contentUri)
```

## Handling Media in Firebase Storage

If you need to upload media files to Firebase:

### Upload from Content URI

#### Kotlin
```kotlin
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference

fun uploadMediaToFirebase(uri: Uri, fileName: String) {
    val storage = FirebaseStorage.getInstance()
    val storageRef = storage.reference
    val mediaRef = storageRef.child("media/$fileName")
    
    // Get file stream
    val stream = contentResolver.openInputStream(uri)
    
    stream?.let {
        val uploadTask = mediaRef.putStream(it)
        
        uploadTask.addOnSuccessListener { taskSnapshot ->
            // Upload successful
            mediaRef.downloadUrl.addOnSuccessListener { downloadUri ->
                Log.d("Firebase", "File uploaded: $downloadUri")
            }
        }.addOnFailureListener { exception ->
            Log.e("Firebase", "Upload failed", exception)
        }.addOnProgressListener { snapshot ->
            val progress = (100.0 * snapshot.bytesTransferred / snapshot.totalByteCount).toInt()
            Log.d("Firebase", "Upload is $progress% done")
        }
    }
}
```

## Best Practices

### 1. Always Check Permissions

```kotlin
fun hasMediaPermission(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.READ_MEDIA_IMAGES
        ) == PackageManager.PERMISSION_GRANTED
    } else {
        ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.READ_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED
    }
}
```

### 2. Handle Permission Denial Gracefully

```kotlin
fun showPermissionRationale() {
    AlertDialog.Builder(this)
        .setTitle("Media Access Required")
        .setMessage("This app needs access to your media files to function properly.")
        .setPositiveButton("Grant") { _, _ ->
            checkAndRequestPermissions()
        }
        .setNegativeButton("Cancel") { dialog, _ ->
            dialog.dismiss()
        }
        .show()
}
```

### 3. Use Try-Catch for File Operations

```kotlin
fun safeReadFile(uri: Uri): ByteArray? {
    return try {
        contentResolver.openInputStream(uri)?.use { it.readBytes() }
    } catch (e: FileNotFoundException) {
        Log.e("MediaAccess", "File not found: $uri", e)
        null
    } catch (e: SecurityException) {
        Log.e("MediaAccess", "Permission denied: $uri", e)
        null
    } catch (e: IOException) {
        Log.e("MediaAccess", "IO error reading: $uri", e)
        null
    }
}
```

### 4. Release Resources

Always close streams and cursors:
```kotlin
// Use 'use' function (Kotlin) for automatic closing
contentResolver.openInputStream(uri)?.use { stream ->
    // Process stream
}

// Or for cursors
contentResolver.query(uri, projection, null, null, null)?.use { cursor ->
    // Process cursor
}
```

### 5. Test on Multiple Android Versions

Test your media access code on:
- Android 9 (API 28) - Pre-scoped storage
- Android 10 (API 29) - Scoped storage introduced
- Android 11 (API 30) - Scoped storage enforced
- Android 13 (API 33) - Granular permissions

## Troubleshooting

### Issue: "Permission Denial" Error

**Problem:** App crashes with SecurityException when accessing content URI

**Solutions:**
1. Check if permission is declared in `AndroidManifest.xml`
2. Verify runtime permission is granted
3. For SAF URIs, ensure `takePersistableUriPermission()` was called
4. Check if the file still exists

### Issue: "FileNotFoundException" for Valid URI

**Problem:** Content URI throws FileNotFoundException even though file exists

**Solutions:**
1. File may have been deleted by user or another app
2. MediaStore database may be out of sync
3. Check if your app has the required permissions
4. Try requesting the file again through SAF

### Issue: Content URI Working on Some Devices but Not Others

**Problem:** Same code works on one device but fails on another

**Solutions:**
1. Different Android versions have different storage behaviors
2. Check if you're handling all API levels correctly
3. Some OEMs (Samsung, Xiaomi, etc.) have custom storage implementations
4. Test with version-specific code paths

### Issue: Cannot Access Files After App Reinstall

**Problem:** Persistable URI permissions lost after reinstall

**Solutions:**
1. Persistable permissions are tied to app installation
2. Request file access again through SAF after reinstall
3. Consider cloud backup of file references
4. Document this limitation to users

### Issue: Slow Performance Loading Many Media Files

**Problem:** App lags when loading large media libraries

**Solutions:**
1. Use pagination when querying MediaStore
2. Load thumbnails instead of full images
3. Implement background loading with coroutines/AsyncTask
4. Use image loading libraries (Glide, Picasso) with caching
5. Load images on-demand as user scrolls

## Testing Your Implementation

### Unit Test Example

```kotlin
@Test
fun testReadFileFromContentUri() {
    val mockUri = Uri.parse("content://media/external/file/1000008593")
    val mockInputStream = ByteArrayInputStream("test data".toByteArray())
    
    `when`(mockContentResolver.openInputStream(mockUri))
        .thenReturn(mockInputStream)
    
    val result = readFileFromContentUri(mockUri)
    
    assertNotNull(result)
    assertEquals("test data", String(result!!))
}
```

### Manual Testing Checklist

- [ ] Test with no permissions granted
- [ ] Test with permissions granted
- [ ] Test with revoked permissions
- [ ] Test with invalid content URIs
- [ ] Test with deleted files
- [ ] Test on Android 9, 10, 11, 13+
- [ ] Test on different device manufacturers
- [ ] Test with large files (>100MB)
- [ ] Test with many files (1000+)
- [ ] Test offline functionality

## Example: Complete Media Gallery

Here's a complete example of a simple media gallery:

### Kotlin
```kotlin
class MediaGalleryActivity : AppCompatActivity() {
    
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: MediaAdapter
    private val mediaItems = mutableListOf<Uri>()
    
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            loadMediaFiles()
        } else {
            showPermissionDeniedDialog()
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_media_gallery)
        
        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 3)
        adapter = MediaAdapter(mediaItems)
        recyclerView.adapter = adapter
        
        checkPermissionsAndLoadMedia()
    }
    
    private fun checkPermissionsAndLoadMedia() {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_IMAGES
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }
        
        when {
            ContextCompat.checkSelfPermission(this, permission) == 
                PackageManager.PERMISSION_GRANTED -> {
                loadMediaFiles()
            }
            shouldShowRequestPermissionRationale(permission) -> {
                showPermissionRationale {
                    requestPermissionLauncher.launch(permission)
                }
            }
            else -> {
                requestPermissionLauncher.launch(permission)
            }
        }
    }
    
    private fun loadMediaFiles() {
        lifecycleScope.launch(Dispatchers.IO) {
            val images = queryImages()
            withContext(Dispatchers.Main) {
                mediaItems.clear()
                mediaItems.addAll(images)
                adapter.notifyDataSetChanged()
            }
        }
    }
    
    private fun queryImages(): List<Uri> {
        val images = mutableListOf<Uri>()
        val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL)
        } else {
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        }
        
        val projection = arrayOf(MediaStore.Images.Media._ID)
        val sortOrder = "${MediaStore.Images.Media.DATE_ADDED} DESC"
        
        contentResolver.query(
            collection,
            projection,
            null,
            null,
            sortOrder
        )?.use { cursor ->
            val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID)
            
            while (cursor.moveToNext()) {
                val id = cursor.getLong(idColumn)
                val contentUri = ContentUris.withAppendedId(
                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    id
                )
                images.add(contentUri)
            }
        }
        
        return images
    }
    
    private fun showPermissionRationale(onAccept: () -> Unit) {
        AlertDialog.Builder(this)
            .setTitle("Permission Required")
            .setMessage("This app needs access to your photos to display them.")
            .setPositiveButton("OK") { _, _ -> onAccept() }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun showPermissionDeniedDialog() {
        AlertDialog.Builder(this)
            .setTitle("Permission Denied")
            .setMessage("Cannot load photos without permission. You can grant permission in app settings.")
            .setPositiveButton("Settings") { _, _ ->
                startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = Uri.fromParts("package", packageName, null)
                })
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}

class MediaAdapter(private val items: List<Uri>) : 
    RecyclerView.Adapter<MediaAdapter.ViewHolder>() {
    
    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ImageView = view.findViewById(R.id.imageView)
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_media, parent, false)
        return ViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val uri = items[position]
        Glide.with(holder.itemView.context)
            .load(uri)
            .centerCrop()
            .into(holder.imageView)
    }
    
    override fun getItemCount() = items.size
}
```

## Additional Resources

### Official Documentation
- [Scoped Storage Guide](https://developer.android.com/training/data-storage#scoped-storage)
- [MediaStore API](https://developer.android.com/reference/android/provider/MediaStore)
- [Storage Access Framework](https://developer.android.com/guide/topics/providers/document-provider)
- [Content URIs](https://developer.android.com/guide/topics/providers/content-provider-basics#ContentURIs)
- [Request App Permissions](https://developer.android.com/training/permissions/requesting)

### Libraries
- [Glide](https://github.com/bumptech/glide) - Image loading library
- [Picasso](https://square.github.io/picasso/) - Alternative image loading
- [Coil](https://coil-kt.github.io/coil/) - Kotlin-first image loading

### Related Guides
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - For cloud storage integration
- [GOOGLE_PLAY_SIGNED_BUNDLE_GUIDE.md](GOOGLE_PLAY_SIGNED_BUNDLE_GUIDE.md) - For app publishing

## Support

For issues with media access:
1. Check [Android Developer Documentation](https://developer.android.com/)
2. Review [Stack Overflow Android tag](https://stackoverflow.com/questions/tagged/android)
3. Test on multiple devices and Android versions
4. Review device logs with `adb logcat`

## Summary

Working with Android media files requires:
1. **Proper permissions** - Request appropriate runtime permissions
2. **Content URIs** - Use content:// URIs instead of file paths
3. **MediaStore** - Query media collections properly
4. **Error handling** - Handle missing files and denied permissions
5. **Testing** - Test across different Android versions and devices

Following this guide will ensure your app properly handles media files on all Android versions, including working with content URIs like `content://media/external/file/1000008593`.

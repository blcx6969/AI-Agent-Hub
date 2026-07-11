package com.agenthub
import android.annotation.SuppressLint; import android.os.Bundle
import android.webkit.WebChromeClient; import android.webkit.WebView; import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity; import androidx.webkit.WebSettingsCompat; import androidx.webkit.WebViewFeature
@SuppressLint("SetJavaScriptEnabled")
class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this); setContentView(webView)
        webView.settings.apply {
            javaScriptEnabled = true; domStorageEnabled = true
            allowFileAccess = false; allowContentAccess = false
            setSupportZoom(false); builtInZoomControls = false
            displayZoomControls = false; loadWithOverviewMode = true; useWideViewPort = true
        }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK))
            WebSettingsCompat.setForceDark(webView.settings, WebSettingsCompat.FORCE_DARK_AUTO)
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = WebViewClient()
        webView.setOnLongClickListener { true }; webView.isLongClickable = false
        webView.loadUrl("file:///android_asset/index.html")
    }
    override fun onBackPressed() { if (webView.canGoBack()) webView.goBack() else super.onBackPressed() }
}

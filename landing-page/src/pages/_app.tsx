import type { AppProps } from "next/app";
import Router from 'next/router';
import Script from 'next/script';
import NProgress from 'nprogress';
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";

import "nprogress/nprogress.css";
import "../styles/globals.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <Globalcontext> */}
      <AuthProvider>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>SC Advogados - Soluções jurídicas descomplicadas</title>
        <link
          rel="stylesheet"
          href="/vendors/mdi/css/materialdesignicons.min.css"
        />
        <link
          rel="stylesheet"
          href="/vendors/owl.carousel/css/owl.carousel.css"
        />
        <link
          rel="stylesheet"
          href="/vendors/owl.carousel/css/owl.theme.default.min.css"
        />
        <link rel="stylesheet" href="/vendors/aos/css/aos.css" />
        <link
          rel="stylesheet"
          href="/vendors/jquery-flipster/css/jquery.flipster.css"
        />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="shortcut icon" href="/images/favicon.png" />

        {/* Google Tag Manager */}
        <Script
          id="google-gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K4ZGKHN');`,
          }}
        />
        {/* End Google Tag Manager */}

        <Header />

        <Component {...pageProps} />

        <Footer />

        {/* importações js template */}
        <script defer src="/vendors/base/vendor.bundle.base.js"></script>
        <script defer src="/vendors/owl.carousel/js/owl.carousel.js"></script>
        <script defer src="/vendors/aos/js/aos.js"></script>
        <script
          defer
          src="/vendors/jquery-flipster/js/jquery.flipster.min.js"
        ></script>
        <script defer src="/js/template.js"></script>
      </AuthProvider>
      {/* </Globalcontext> */}
    </>
  );
}

export default MyApp;

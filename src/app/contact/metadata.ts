import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Fit & Kit",
    description:
        "Get in touch with the Fit & Kit team. We're here to help with any questions about our products, orders, or services.",
    openGraph: {
        title: "Contact Us | Fit & Kit",
        description:
            "Get in touch with the Fit & Kit team. We're here to help with any questions about our products, orders, or services.",
        url: "https://fitandkit.shop/contact",
        siteName: "Fit & Kit",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/mainLogoCropped.jpg",
                width: 800,
                height: 600,
                alt: "Fit & Kit Logo",
            },
        ],
    },
};

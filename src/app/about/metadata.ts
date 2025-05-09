import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Fit & Kit",
    description:
        "Learn about Fit & Kit, your go-to destination for stylish, functional, and confidence-boosting menswear.",
    openGraph: {
        title: "About Us - Fit & Kit",
        description:
            "Learn about Fit & Kit, your go-to destination for stylish, functional, and confidence-boosting menswear.",
        url: "https://fitandkit.shop/about",
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

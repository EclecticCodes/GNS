"use client";
import { PageWrapper } from "../Components/PageWrapper";
import Header from "../Components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AboutPageData {
  title: string;
  heading: string;
  text: string;
  image: {
    url: string;
    alternativeText: string;
  };
  businessEmail: string;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/about-uses");
        
        if (!response.ok) {
          throw new Error("Failed to fetch about page data");
        }
        
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        console.error("Error fetching about page data:", err);
        setError("Failed to load about page content");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const displayTitle = aboutData?.title || "About Us";
  const displayHeading = aboutData?.heading || "Our Story";
  const displayText = aboutData?.text || 
    "Welcome to Good Natured Souls, a media company thriving in the cultural epicenter of New York City. We're here to nurture and showcase the vibrant, authentic talent that our city has to offer. Our name reflects our core belief that creativity flourishes best when it's rooted in kindness, purpose, and a deep connection to the community. Guided by our motto, \"Exist Altruistic\", we aim to be a beacon of positivity and artistic growth and set the standard for excellence in the music industry.";
  const displayImage = aboutData?.image?.url || "/images/jumbotronFour.jpg";
  const displayAlt = aboutData?.image?.alternativeText || "About Us";
  const displayEmail = aboutData?.businessEmail || "goodnaturedsouls@gmail.com";

  return (
    <PageWrapper>
      {/* Header Section */}
      <section className="text-center my-8">
        <Header>
          <h1 className="text-4xl font-bold">{displayTitle}</h1>
        </Header>
      </section>

    
      {loading && (
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-lg">Loading...</p>
        </div>
      )}

   
      {error && !loading && (
        <div className="max-w-6xl mx-auto p-6 text-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      )}

      {/* Main Layout - Image on Left, Text on Right */}
      {!loading && (
        <main className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row items-center gap-8">
         
          <section className="flex-1 flex justify-center">
            <Image
              src={displayImage}
              alt={displayAlt}
              width={400}
              height={400}
              className="w-full max-w-md rounded-lg shadow-lg"
              unoptimized={displayImage.startsWith('http')}
            />
          </section>


          <section className="flex-1">
            <h2 className="text-4xl font-bold mb-4">{displayHeading}</h2>
            <p className="text-lg mb-4 whitespace-pre-line">{displayText}</p>

            <h3 className="text-2xl font-bold mb-4">Business Inquiries</h3>
            <p className="text-lg">{displayEmail}</p>
          </section>
        </main>
      )}
    </PageWrapper>
  );
}

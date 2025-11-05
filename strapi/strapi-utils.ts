import strapiClient from "./strapi-client";
import { Artist } from "@/types/Artist";

const revalidate = 10;

export async function getArtists(): Promise<Artist[]> {
  try {
    const data = await strapiClient.fetch(
      "/artists?populate=*&sort[0]=orderRank:asc",
      {
        next: { revalidate },
      }
    );
    console.log("Fetched Strapi Artists:", data.data);

    // Map Strapi data to expected format
    const artists = (data.data || []).map((rawArtist: any) => ({
      _id: rawArtist.documentId || rawArtist.id,
      _createdAt: rawArtist.createdAt,
      name: rawArtist.name,
      slug: rawArtist.slug,
      profileImage: {
        url: rawArtist.profileImage?.url || "",
      },
      backgroundImage: rawArtist.backgroundImage?.url || "",
      signature: rawArtist.signature || rawArtist.name,
      spotifyEmbedUrl: rawArtist.spotifyEmbedUrl,
      about: rawArtist.about,
      socialMediaLinks: rawArtist.socialMediaLinks || [],
    }));

    return artists;
  } catch (error) {
    console.error("Error fetching artists from Strapi:", error);
    return [];
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const data = await strapiClient.fetch(
      `/artists?filters[slug][$eq]=${slug}&populate=*&sort[0]=orderRank:asc`,
      {
        next: { revalidate },
      }
    );

    if (data.data && data.data.length > 0) {
      console.log("Fetched Strapi Artist by slug:", data.data[0]);
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching artist by slug from Strapi:", error);
    return null;
  }
}

export async function getArtistWithProjects(slug: string) {
  try {
    const artistData = await strapiClient.fetch(
      `/artists?filters[slug][$eq]=${slug}&populate=*&sort[0]=orderRank:asc`,
      {
        next: { revalidate },
      }
    );

    if (!artistData.data || artistData.data.length === 0) {
      return { artist: null, projects: [] };
    }

    const rawArtist = artistData.data[0];

    const artist = {
      _id: rawArtist.documentId || rawArtist.id,
      _createdAt: rawArtist.createdAt,
      name: rawArtist.name,
      slug: rawArtist.slug,
      profileImage: {
        url: rawArtist.profileImage?.url || "",
      },
      backgroundImage: rawArtist.backgroundImage?.url || "",
      signature: rawArtist.signature || rawArtist.name,
      spotifyEmbedUrl: rawArtist.spotifyEmbedUrl,
      about: rawArtist.about,
      socialMediaLinks: rawArtist.socialMediaLinks || [],
    };

    console.log("Raw artist data from Strapi:", rawArtist);
    console.log("Mapped artist data:", artist);

    const projectsData = await strapiClient.fetch(
      `/projects?filters[artists][id][$eq]=${rawArtist.id}&populate=*`,
      {
        next: { revalidate },
      }
    );

    const projects = (projectsData.data || []).map((rawProject: any) => ({
      _id: rawProject.documentId || rawProject.id,
      _createdAt: rawProject.createdAt,
      name: rawProject.name,
      type: rawProject.type,
      url: rawProject.url,
      releaseYear: rawProject.releaseYear,
      coverImageUrl:
        rawProject.cover?.url || rawProject.cover?.data?.attributes?.url || "",
      artist: rawProject.artists?.[0]?.name || "",
      featuredArtists: rawProject.featured?.map((f: any) => f.name) || [],
    }));

    console.log("Fetched artist with projects from Strapi:", {
      artist,
      projects,
    });

    return {
      artist,
      projects,
    };
  } catch (error) {
    console.error("Error fetching artist with projects from Strapi:", error);
    return { artist: null, projects: [] };
  }
}

export async function getAllArtistsWithFeaturedProjects() {
  try {
    const artistsData = await strapiClient.fetch("/artists?populate=*", {
      next: { revalidate },
    });

    const projectsData = await strapiClient.fetch(
      "/projects?populate=*&sort[0]=createdAt:desc&pagination[limit]=3",
      {
        next: { revalidate },
      }
    );

    const artists = (artistsData.data || []).map((rawArtist: any) => ({
      _id: rawArtist.documentId || rawArtist.id,
      _createdAt: rawArtist.createdAt,
      name: rawArtist.name,
      slug: rawArtist.slug,
      profileImage: {
        url:
          rawArtist.profileImage?.url ||
          rawArtist.profileImage?.data?.attributes?.url ||
          "",
      },
      backgroundImage:
        rawArtist.backgroundImage?.url ||
        rawArtist.backgroundImage?.data?.attributes?.url ||
        "",
      signature: rawArtist.signature || rawArtist.name,
      spotifyEmbedUrl: rawArtist.spotifyEmbedUrl,
      about: rawArtist.about,
      socialMediaLinks: rawArtist.socialMediaLinks || [],
    }));

    const featuredProjects = (projectsData.data || []).map(
      (rawProject: any) => ({
        _id: rawProject.documentId || rawProject.id,
        _createdAt: rawProject.createdAt,
        name: rawProject.name,
        type: rawProject.type,
        url: rawProject.url,
        releaseYear: rawProject.releaseYear,
        coverImageUrl:
          rawProject.cover?.url ||
          rawProject.cover?.data?.attributes?.url ||
          "",
        artist: rawProject.artists?.[0]?.name || "",
        featuredArtists: rawProject.featured?.map((f: any) => f.name) || [],
      })
    );

    console.log("Fetched artists and featured projects from Strapi:", {
      artists,
      featuredProjects,
    });

    return {
      artists,
      featuredProjects,
    };
  } catch (error) {
    console.error(
      "Error fetching artists with featured projects from Strapi:",
      error
    );
    return {
      artists: [],
      featuredProjects: [],
    };
  }
}

export async function getAllArtistsWithProjects() {
  try {
    const data = await strapiClient.fetch("/projects?populate=*", {
      next: { revalidate },
    });

    console.log("Fetched all artists with projects from Strapi:", data.data);
    return {
      artists: data.data,
      featuredProjects: data.data.slice(0, 3),
    };
  } catch (error) {
    console.error("Error fetching artists with projects from Strapi:", error);
    return {
      artists: [],
      featuredProjects: [],
    };
  }
}

export async function getMains() {
  try {
    const data = await strapiClient.fetch("/mains?populate=*", {
      next: { revalidate },
    });

    // Transform the response to only include the required fields
    const mains = (data.data || []).map((rawMain: any) => ({
      mainheading: rawMain.mainheading || "",
      para: rawMain.para || "",
      formats: {
        small: {
          url: rawMain.headericon?.formats?.small?.url || "",
        },
      },
    }));

    console.log("Fetched Strapi Mains:", mains);
    return mains;
  } catch (error) {
    console.error("Error fetching mains from Strapi:", error);
    return [];
  }
}


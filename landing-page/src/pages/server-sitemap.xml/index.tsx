// pages/server-sitemap-index.xml/index.tsx
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";
import api from "../../commons/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data } = await api.get("public-routes/contract");
  const contracts: any[] = data.data;

  const urls: any[] = [];
  contracts.forEach((contract) => {
    urls.push({
      loc: `https://www.advogadossc.com/criar-contrato/${contract.id}`,
      lastmod: contract.updated_at,
    });
  });

  return getServerSideSitemap(ctx, urls);
};

// Default export to prevent next.js errors
export default function Sitemap() {}

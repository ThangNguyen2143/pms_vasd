"use server";
import { notFound } from "next/navigation";
import BugDetailClient from "./client";
import { decodeBase64 } from "~/lib/services";

async function BugDetailPage(props: { params: Promise<{ bug: string }> }) {
  const { bug } = await props.params;
  const { bug_id, product_id } = decodeBase64(decodeURIComponent(bug)) as {
    bug_id: number;
    product_id: string;
  };
  if (!bug_id) notFound();
  return <BugDetailClient bug_id={bug_id} product_id={product_id} />;
}

export default BugDetailPage;

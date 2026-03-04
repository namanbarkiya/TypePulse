import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function PlayPage({ params }: Props) {
  const { category } = await params;
  redirect(`/?cat=${category}`);
}

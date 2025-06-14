import FormLogin from "@/components/auth/FormLogin";

export default async function PageRoute({ params }: { params: Promise<{ slug: string, lang: string }> }) {
    const { slug, lang } = await params;
    return (
        <FormLogin />
    )
}

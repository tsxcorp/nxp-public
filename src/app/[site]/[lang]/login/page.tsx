import FormLogin from "@/components/auth/FormLogin";
import { PageProps } from '@/types/next';

export default async function PageRoute({ params, searchParams }: PageProps) {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([
        params,
        searchParams
    ]);
    const { site, lang } = resolvedParams;
    return (
        <FormLogin />
    )
}

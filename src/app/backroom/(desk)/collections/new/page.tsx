import Link from "next/link";
import { CollectionForm } from "../../../../../components/backroom/collection-form";
import { PageHead, quietButton } from "../../../../../components/backroom/ui";
import { requireAdmin } from "../../../../../lib/backroom-session";
import { supabaseConfigured } from "../../../../../lib/supabase";

export default async function NewCollectionPage() {
  await requireAdmin();
  return (
    <>
      <PageHead kicker="Collections" title="New collection">
        <Link href="/backroom/collections" className={quietButton}>
          ← All collections
        </Link>
      </PageHead>
      <CollectionForm readOnly={!supabaseConfigured()} />
    </>
  );
}

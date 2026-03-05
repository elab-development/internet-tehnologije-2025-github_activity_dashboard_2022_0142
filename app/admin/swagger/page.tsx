import { getApiDocs } from '@/lib/swagger';
import SwaggerComponent from '@/components/SwaggerComponent';
import { vt323 } from '@/app/layout';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className={`container swagger-page ${vt323.className}`}>
      <SwaggerComponent spec={spec} />
    </section>
  );
}
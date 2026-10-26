import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useFetcher, useLoaderData } from "react-router";

type ActionData = { ok: true } | { ok: false; error: string };

function parseNumberField(form: FormData, key: string): number | null {
  const raw = form.get(key);
  if (raw === null || String(raw).trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await prisma.settings.findUnique({
    where: { shop: session.shop },
  });

  return { settings };
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ActionData> => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();

  const cutoffHour = parseNumberField(form, "cutoffHour");
  const processingDays = parseNumberField(form, "processingDays");
  const shippingDays = parseNumberField(form, "shippingDays");
  //   const processingDays = Number(form.get("processingDays"));
  //   const shippingDays = Number(form.get("shippingDays"));
  const messageTemplate = String(form.get("messageTemplate") ?? "").trim();

  if (
    cutoffHour === null ||
    !Number.isInteger(cutoffHour) ||
    cutoffHour < 0 ||
    cutoffHour > 23
  ) {
    return {
      ok: false,
      error: "Cutoff hour must be a whole number from 0 to 23.",
    };
  }

  if (
    processingDays === null ||
    !Number.isInteger(processingDays) ||
    processingDays < 0
  ) {
    return {
      ok: false,
      error: "Processing days must be a whole number from 0 or more",
    };
  }

  if (
    shippingDays === null ||
    !Number.isInteger(shippingDays) ||
    shippingDays < 0
  ) {
    return { ok: false, error: "Shipping days must be 0 or more." };
  }

  if (!messageTemplate) {
    return { ok: false, error: "Message cannot be empty." };
  }

  const data = { cutoffHour, processingDays, shippingDays, messageTemplate };

  await prisma.settings.upsert({
    where: { shop: session.shop },
    update: data,
    create: { shop: session.shop, ...data },
  });

  return { ok: true };
};

export default function SettingsPage() {
  const { settings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const saving = fetcher.state !== "idle";

  return (
    <s-page heading="Delivery data settings">
      <fetcher.Form method="post">
        <s-section heading="Rules">
          <s-stack gap="base">
            <s-text-field
              label="Cutoff hour (0-23"
              name="cutoffHour"
              defaultValue={String(settings?.cutoffHour ?? 14)}
            />
            <s-text-field
              label="Processing days"
              name="processingDays"
              defaultValue={String(settings?.processingDays ?? 1)}
            />
            <s-text-field
              label="Shipping days"
              name="shippingDays"
              defaultValue={String(settings?.shippingDays ?? 4)}
            />
            <s-text-field
              label="Message"
              name="messageTemplate"
              defaultValue={settings?.messageTemplate ?? "Get it by {date}"}
            />
            <s-button type="submit" variant="primary" loading={saving}>
              {saving ? "Saving..." : "Save"}
            </s-button>
          </s-stack>
        </s-section>
      </fetcher.Form>

      {fetcher.data?.ok === true && (
        <s-banner tone="success">Settings saved!</s-banner>
      )}

      {fetcher.data?.ok === false && (
        <s-banner tone="critical">{fetcher.data.error}</s-banner>
      )}
    </s-page>
  );
}

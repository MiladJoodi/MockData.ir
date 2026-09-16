import { businessTopics } from "@/lib/generator/schemas/business";
import { contentTopics } from "@/lib/generator/schemas/content";
import { ecommerceTopics } from "@/lib/generator/schemas/ecommerce";
import { locationTopics } from "@/lib/generator/schemas/location";
import { mediaTopics } from "@/lib/generator/schemas/media";
import { peopleTopics } from "@/lib/generator/schemas/people";
import type {
  GeneratorFieldDef,
  GeneratorTopic,
  GeneratorTopicId,
} from "@/lib/generator/types";

function withMetaFields(topic: GeneratorTopic): GeneratorTopic {
  const withoutDates = topic.fields.filter(
    (f) => f.id !== "createdAt" && f.id !== "updatedAt",
  );
  const have = new Set(withoutDates.map((f) => f.id));
  const fields: GeneratorFieldDef[] = [...withoutDates];
  if (!have.has("id")) {
    fields.unshift({ id: "id", default: false });
  }
  // Always last in the chip list and schema order
  fields.push(
    { id: "createdAt", default: false },
    { id: "updatedAt", default: false },
  );
  return { ...topic, fields };
}

export const GENERATOR_TOPICS: GeneratorTopic[] = [
  ...peopleTopics,
  ...ecommerceTopics,
  ...contentTopics,
  ...mediaTopics,
  ...businessTopics,
  ...locationTopics,
].map(withMetaFields);

const BY_ID = new Map<GeneratorTopicId, GeneratorTopic>(
  GENERATOR_TOPICS.map((t) => [t.id, t]),
);

export function getGeneratorTopic(
  id: string,
): GeneratorTopic | undefined {
  return BY_ID.get(id as GeneratorTopicId);
}

export function defaultFieldSet(topic: GeneratorTopic): Set<string> {
  return new Set(topic.fields.filter((f) => f.default).map((f) => f.id));
}

export function allowedFieldIds(topic: GeneratorTopic): Set<string> {
  return new Set(topic.fields.map((f) => f.id));
}

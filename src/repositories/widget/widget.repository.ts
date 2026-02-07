import { prisma } from "@/libs/prisma";

export enum WidgetTypeSlug {
    FIRST_WORD = "first-word",
    CLIP_SHOUTOUT = "clip-shoutout"
}

export default class WidgetRepository {
    private readonly widgetTypeSlug: WidgetTypeSlug;
    private readonly include: Record<string, boolean>;
    constructor(widgetTypeSlug: WidgetTypeSlug) {
        this.widgetTypeSlug = widgetTypeSlug;
        this.include = {
            firstWord: true,
            clipShoutout: true
        }
    }

    async getWidgetType() {
        return prisma.widgetType.findUniqueOrThrow({ where: { slug: this.widgetTypeSlug } });
    }

    async getByOwnerId(owner_id: string) {
        const type = await this.getWidgetType();
        return prisma.widget.findUnique({
            where: { owner_id_widgetTypeId: { owner_id, widgetTypeId: type.id } }, include: {
                firstWord: true,
                clipShoutout: true
            }
        });
    }
}
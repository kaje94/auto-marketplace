import type { Meta, StoryObj } from "@storybook/react";

import { Modal } from "./Modal";
import { ModalFooter } from "./ModalFooter";

const meta = {
    title: "Common/Modal",
    component: Modal,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            return (
                <div className="h-[50vh]">
                    <Story
                        args={{
                            ...ctx.args,
                            children: (
                                <>
                                    <h1 className="text-lg">Title</h1>
                                    <ModalFooter primaryButton={{ text: "Submit" }} />
                                </>
                            ),
                        }}
                    />
                </div>
            );
        },
    ],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        visible: true,
    },
};

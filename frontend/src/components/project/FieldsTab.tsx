import { Alert, Card, Grid, Group, Stack, Tabs, Text } from "@mantine/core";
import { FieldDetails } from "../../types/Project";
import { IoMdInformationCircleOutline } from "react-icons/io";

export function FieldsTab({ fields }: { fields: FieldDetails[]}) {
    return (
        <Tabs.Panel value="fields" px="sm" py="lg">
            {Object.keys(fields).length > 0 ? (
                <Stack>
                    <Text size="sm" c="dimmed">
                        Fields
                    </Text>
                    <Grid grow>
                        {fields.map(field => (
                            <Grid.Col
                                span={{ base: 12, sm: 6, md: 4, xl: 3 }}
                                key={field.name}
                            >
                                <Card
                                    className="h-full gap-3"
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Group>
                                        <Stack justify="flex-start" gap={0}>
                                            <p className="text-md font-bold text-[#5c8593] pb-1">
                                                {field.name}
                                            </p>
                                            <Text size="sm" c="dimmed">
                                                {field.value}
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Stack>
            ) : (
                <Alert
                    variant="light"
                    color="#5c8593"
                    title="This project has no fields."
                    icon={<IoMdInformationCircleOutline />}
                >
                    
                </Alert>
            )}
        </Tabs.Panel>
    );
}
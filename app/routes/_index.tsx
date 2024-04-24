import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Center, Box, Flex, Select, Button } from "@chakra-ui/react";

import { isValidLevel, isValidMovement } from "../levels";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const level = formData.get("level");
  const movement = formData.get("movement");

  const isValid =
    level && movement && isValidLevel(level) && isValidMovement(movement);
  if (isValid) {
    throw redirect(`/workout/${level}/${movement}`);
  }

  return json({ formError: "Invalid level or movement" });
};

export default function Index() {
  return (
    <Center flexDirection={"column"} gap={6}>
      <Box>
        <Form method="post">
          <Flex flexDirection={"column"} gap={4}>
            <Select name="level" id="level">
              <option value="1b">Level 1B</option>
              <option value="1c">Level 1C</option>
              <option value="1d">Level 1D</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
            </Select>
            <Select name="movement" id="movement">
              <option value="6-count">6-count</option>
              <option value="10-count">10-count/navy seal</option>
            </Select>
            <Button colorScheme="teal" type="submit">
              Submit
            </Button>
          </Flex>
        </Form>
      </Box>
    </Center>
  );
}

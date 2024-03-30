import { useState } from "react";
import { Center, Box, Flex, Select, Button } from "@chakra-ui/react";

import { isValidLevel, isValidMovement, levelsMapping } from "../levels";
import Workout from "../components/Workout";

export default function Index() {
  const [totalSets, setTotalSets] = useState<number | null>(null);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const level = formData.get("level") as string;
    const movement = formData.get("movement") as string;

    if (isValidLevel(level) && isValidMovement(movement)) {
      setWorkoutComplete(false);
      setTotalSets(levelsMapping[level][movement]);
    }
  }

  return (
    <Center flexDirection={"column"} gap={6}>
      <Box>
        <form onSubmit={handleSubmit}>
          <Flex flexDirection={"column"} gap={4}>
            <Select name="level" id="level">
              <option value="1a">Level 1A</option>
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
        </form>
      </Box>

      {totalSets && (
        <Workout totalSets={totalSets} workoutComplete={setWorkoutComplete} />
      )}

      {workoutComplete && <div>Workout completed!</div>}
    </Center>
  );
}

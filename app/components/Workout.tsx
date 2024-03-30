import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from "react";
import { Button, ButtonGroup, Center, Box, Text } from "@chakra-ui/react";
import Sound from "../assets/sound.wav";

import { useTimer } from "../hooks/useTimer";

const TOTAL_DURATION_IN_SECONDS = 20 * 60;
interface WorkoutProps {
  totalSets: number;
  workoutComplete: Dispatch<SetStateAction<boolean>>;
}

function Workout({ totalSets, workoutComplete }: WorkoutProps) {
  const secondsPerSet = Math.round(TOTAL_DURATION_IN_SECONDS / totalSets);
  const [sets, setSets] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const {
    remainingSeconds: remainingReadySeconds,
    start: startReadyTimer,
    stop: stopReadyTimer,
    reset: resetReadyTimer,
  } = useTimer(3);
  const {
    remainingSeconds: remainingSecondsInSet,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useTimer(secondsPerSet);
  const soundRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    soundRef.current = new Audio(Sound);
  }, []);

  const playSound = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.play();
    }
  }, [soundRef.current]);

  function handleStartTimer() {
    playSound();
    workoutComplete(false);
    if (workoutStarted) {
      startTimer();
    } else {
      startReadyTimer();
    }
  }

  function pauseWorkout() {
    if (workoutStarted) {
      stopTimer();
    } else {
      stopReadyTimer();
    }
  }

  function resetWorkout() {
    resetReadyTimer();
    resetTimer();
    setWorkoutStarted(false);
    setSets(0);
  }

  useEffect(() => {
    resetWorkout();
  }, [totalSets]);

  useEffect(() => {
    if (sets >= totalSets) {
      stopTimer();
      workoutComplete(true);
    }
  }, [sets]);

  useEffect(() => {
    if (remainingReadySeconds <= 0) {
      setWorkoutStarted(true);
      setSets(1);
      playSound();
      startTimer();
    }
  }, [remainingReadySeconds]);

  useEffect(() => {
    if (remainingSecondsInSet !== null && remainingSecondsInSet <= 0) {
      setSets((currentSet) => ++currentSet);
      playSound();
      startTimer();
    }
  }, [remainingSecondsInSet]);

  return (
    <Center flexDirection={"column"} gap={4}>
      <Box>
        <Text fontSize={"5xl"}>
          {sets}/{totalSets} reps
        </Text>
      </Box>
      <Box>
        {workoutStarted ? (
          <Text fontSize={"10rem"}>{remainingSecondsInSet}</Text>
        ) : (
          <Text fontSize={"10rem"} color="green">
            {remainingReadySeconds}
          </Text>
        )}
      </Box>
      <ButtonGroup>
        <Button colorScheme="green" onClick={handleStartTimer}>
          Start
        </Button>
        <Button variant="outline" onClick={pauseWorkout}>
          Stop
        </Button>
        <Button colorScheme="orange" onClick={resetWorkout}>
          Reset
        </Button>
      </ButtonGroup>
    </Center>
  );
}

export default Workout;

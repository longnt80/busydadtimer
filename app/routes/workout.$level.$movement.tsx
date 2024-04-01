import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from "react";
import { Button, ButtonGroup, Center, Box, Text } from "@chakra-ui/react";

import { useTimer } from "../hooks/useTimer";
import { isValidLevel, isValidMovement, levelsMapping } from "../levels";
import Sound from "../assets/sound.wav";

const TOTAL_DURATION_IN_SECONDS = 20 * 60;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { level, movement } = params;
  const isValid = level && movement && isValidLevel(level) && isValidMovement(movement);
  if (isValid) {
    return json(levelsMapping[level][movement]);
  }

  throw redirect("/");
}

export default function Workout() {
  const totalSets = useLoaderData<typeof loader>();
  
  const secondsPerSet = Math.round(TOTAL_DURATION_IN_SECONDS / totalSets);
  const [sets, setSets] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutInit, setWorkoutInit] = useState(false);
  const {
    remainingSeconds: remainingReadySeconds,
    start: startReadyTimer,
    stop: stopReadyTimer,
    reset: resetReadyTimer,
  } = useTimer(5);
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
    if (!workoutInit) {
      setWorkoutInit(true);
    }

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
    setWorkoutInit(false);
    setSets(0);
  }

  useEffect(() => {
    resetWorkout();
  }, [totalSets]);

  useEffect(() => {
    if (sets >= totalSets) {
      stopTimer();
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
      {workoutInit &&
        <Box>
          {workoutStarted ? (
            <Text fontSize={"10rem"}>{remainingSecondsInSet}</Text>
          ) : (
            <Text fontSize={"10rem"} color="green">
              {remainingReadySeconds}
            </Text>
          )}
        </Box>
      }
      <ButtonGroup>
        <Button colorScheme="green" onClick={handleStartTimer}>
          Start
        </Button>
        {workoutInit &&
          <>
            <Button variant="outline" onClick={pauseWorkout}>
              Pause
            </Button>
            <Button colorScheme="orange" onClick={resetWorkout}>
              Reset
            </Button>
          </>
        }
      </ButtonGroup>
      {workoutInit && 
        <ButtonGroup>
          <Button colorScheme="red">Abort</Button>
        </ButtonGroup>
      }
    </Center>
  );
}
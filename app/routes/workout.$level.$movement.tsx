import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Center,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { useTimer } from "../hooks/useTimer";
import { isValidLevel, isValidMovement, levelsMapping } from "../levels";
import Sound from "../assets/bell.wav";

const TOTAL_DURATION_IN_SECONDS = 20 * 60;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { level, movement } = params;
  const isValid =
    level && movement && isValidLevel(level) && isValidMovement(movement);
  if (isValid) {
    return json(levelsMapping[level][movement]);
  }

  throw redirect("/");
};

export default function Workout() {
  const totalSets = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
  const wakelock = useRef<WakeLockSentinel | null>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    soundRef.current = new Audio(Sound);
  }, []);

  const playSound = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.play();
    }
  }, []);

  const requestWakeLock = async () => {
    try {
      wakelock.current = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.log(err);
    }
  };

  function handleStartTimer() {
    if (!wakelock.current) {
      requestWakeLock();
    }

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

  const resetWorkout = useCallback(() => {
    resetReadyTimer();
    resetTimer();
    setWorkoutStarted(false);
    setWorkoutInit(false);
    setSets(0);
    wakelock.current?.release();
    wakelock.current = null;
  }, [resetReadyTimer, resetTimer]);

  function abort() {
    resetWorkout();
    navigate("/");
  }

  useEffect(() => {
    resetWorkout();
  }, [totalSets, resetWorkout]);

  useEffect(() => {
    if (sets >= totalSets) {
      stopTimer();
    }
  }, [sets, totalSets, stopTimer]);

  useEffect(() => {
    if (remainingReadySeconds <= 0) {
      setWorkoutStarted(true);
      setSets(1);
      playSound();
      startTimer();
    }
  }, [remainingReadySeconds, playSound, startTimer]);

  useEffect(() => {
    if (remainingSecondsInSet !== null && remainingSecondsInSet <= 0) {
      setSets((currentSet) => ++currentSet);
      playSound();
      startTimer();
    }
  }, [remainingSecondsInSet, playSound, startTimer]);

  useEffect(() => {
    return () => {
      wakelock.current?.release();
      wakelock.current = null;
    };
  }, []);

  return (
    <>
      <Center flexDirection={"column"} gap={4}>
        <Box data-testid="reps-completed">
          <Text fontSize={"5xl"}>
            {sets}/{totalSets} reps
          </Text>
        </Box>
        {workoutInit && (
          <Box>
            {workoutStarted ? (
              <Text fontSize={"10rem"}>{remainingSecondsInSet}</Text>
            ) : (
              <Text fontSize={"10rem"} color="green">
                {remainingReadySeconds}
              </Text>
            )}
          </Box>
        )}
        <ButtonGroup>
          <Button
            colorScheme="green"
            onClick={handleStartTimer}
            data-testid="start-button"
          >
            Start
          </Button>
          {workoutInit && (
            <>
              <Button variant="outline" onClick={pauseWorkout}>
                Pause
              </Button>
              <Button colorScheme="orange" onClick={resetWorkout}>
                Reset
              </Button>
            </>
          )}
        </ButtonGroup>
        {workoutInit && (
          <ButtonGroup>
            <Button
              colorScheme="red"
              onClick={() => {
                onOpen();
              }}
            >
              Abort
            </Button>
          </ButtonGroup>
        )}
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Do you want to abort this workout?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={abort}>
              Abort
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

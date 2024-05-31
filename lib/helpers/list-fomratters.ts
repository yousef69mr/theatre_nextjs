import {
  PlayCardType,
  ExecutorCardType,
  PlayType,
  ActorType,
  ActorCardType,
  ExecutorType,
} from "@/types";

export function removePlayActorDuplicates(play: PlayType): ActorCardType[] {
  const uniqueActorsMap = new Map<string, ActorCardType>();

  // Iterate through the actors array and add unique actors to the map
  for (const actorLink of play.actors) {
    if (!uniqueActorsMap.has(actorLink.actor.id)) {
      actorLink.imgUrl;
      uniqueActorsMap.set(actorLink.actor.id, {
        ...actorLink.actor,
        images: actorLink.imgUrl ? [actorLink.imgUrl] : [],
        characterNames: actorLink.characterNames,
        festivals: [actorLink],
      });
    } else {
      const existingActor = uniqueActorsMap.get(actorLink.actor.id)!;

      existingActor.characterNames?.push(...actorLink.characterNames);

      actorLink.imgUrl && existingActor.images?.push(actorLink.imgUrl);

      existingActor.festivals!.push(actorLink);
    }
  }

  // Convert the unique actors map values back to an array
  const uniqueActors = Array.from(uniqueActorsMap.values());

  return uniqueActors;
}

export function removePlayExecutorDuplicates(
  play: PlayType
): ExecutorCardType[] {
  const uniqueExecutorsMap = new Map<string, ExecutorCardType>();

  // Iterate through the actors array and add unique actors to the map
  for (const executorLink of play.executors) {
    if (!uniqueExecutorsMap.has(executorLink.executor.id)) {
      uniqueExecutorsMap.set(executorLink.executor.id, {
        ...executorLink.executor,
        roles: [executorLink.role],
        festivals: [executorLink],
      });
    } else {
      const existingExecutor = uniqueExecutorsMap.get(
        executorLink.executor.id
      )!;
      existingExecutor.roles!.push(executorLink.role);
      existingExecutor.festivals!.push(executorLink);
    }
  }

  // Convert the unique actors map values back to an array
  const uniqueActors = Array.from(uniqueExecutorsMap.values());

  return uniqueActors;
}

export function removeActorPlayDuplicates(actor: ActorType): PlayCardType[] {
  const uniquePlaysMap = new Map<string, PlayCardType>();

  // Iterate through the actors array and add unique actors to the map
  for (const playLink of actor.plays) {
    if (!uniquePlaysMap.has(playLink.play.id)) {
      uniquePlaysMap.set(playLink.play.id, {
        ...playLink.play,
        characterNames: [...playLink.characterNames],
        // festivals: [...playLink],
      });
    } else {
      const existingPlay = uniquePlaysMap.get(playLink.play.id)!;
      existingPlay.characterNames!.push(...playLink.characterNames);
    }
  }

  // Convert the unique actors map values back to an array
  const uniquePlays = Array.from(uniquePlaysMap.values());

  return uniquePlays;
}

export function removeExecutorPlayDuplicates(
  executor: ExecutorType
): PlayCardType[] {
  const uniquePlaysMap = new Map<string, PlayCardType>();

  // Iterate through the actors array and add unique actors to the map
  for (const playLink of executor.plays) {
    if (!uniquePlaysMap.has(playLink.play.id)) {
      uniquePlaysMap.set(playLink.play.id, {
        ...playLink.play,
        executorRoles: [playLink.role],
        // festivals: [...playLink],
      });
    } else {
      const existingPlay = uniquePlaysMap.get(playLink.play.id)!;
      !existingPlay.executorRoles?.includes(playLink.role) &&
        existingPlay.executorRoles!.push(playLink.role);
    }
  }
  // console.log(uniquePlaysMap);
  // Convert the unique actors map values back to an array
  const uniquePlays = Array.from(uniquePlaysMap.values());

  return uniquePlays;
}

export function removeArrayDuplicates(strings: string[]): string[] {
  // Create a Set to store unique lowercase strings
  const uniqueStrings = new Set(strings.map((str) => str.toLowerCase()));

  // Convert the lowercase strings back to their original case and filter out undefined values
  const uniqueStringsArray = Array.from(uniqueStrings, (str) =>
    strings.find((s) => s.toLowerCase() === str)
  ).filter((str) => str !== undefined) as string[];

  return uniqueStringsArray;
}

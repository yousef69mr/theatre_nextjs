"use client";

import { useEffect, useState } from "react";
import CreateExecutorModal from "@/components/modals/executor/create-executor-modal";
import { DeleteExecutorModal } from "@/components/modals/executor/delete-executor-modal";
import CreateActorModal from "@/components/modals/actor/create-actor-modal";
import { DeleteActorModal } from "@/components/modals/actor/delete-actor-modal";
import { DeletePlayModal } from "@/components/modals/play/delete-play-modal";
import LinkActorPlayModal from "@/components/modals/actorInPlay/link-actor-play-modal";
import CreateFestivalModal from "@/components/modals/festival/create-festival-modal";
import { DeleteActorPlayLinkModal } from "@/components/modals/actorInPlay/delete-actor-play-link-modal";
import { DeleteFestivalPlayLinkModal } from "@/components/modals/festivalPlay/delete-festival-play-link-modal";
import LinkFestivalPlayModal from "@/components/modals/festivalPlay/link-festival-play-modal";
import { DeleteCastMemberModal } from "@/components/modals/castMember/delete-cast-member-modal";
import LinkCastMemberModal from "@/components/modals/castMember/link-cast-member-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateExecutorModal />
      <DeleteExecutorModal />
      <CreateActorModal />
      <DeleteActorModal />
      <DeletePlayModal />
      <CreateFestivalModal />
      <LinkActorPlayModal />
      <DeleteActorPlayLinkModal />
      <LinkFestivalPlayModal />
      <DeleteFestivalPlayLinkModal />
      <LinkCastMemberModal />
      <DeleteCastMemberModal />
    </>
  );
};

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
import LinkExecutorPlayModal from "@/components/modals/executorInPlay/link-executor-play-modal";
import { DeleteExecutorPlayLinkModal } from "@/components/modals/executorInPlay/delete-executor-play-link-modal";
import { DeleteUserModal } from "@/components/modals/user/delete-user-modal";
import { DeleteTicketModal } from "@/components/modals/ticket/delete-ticket-modal";
import { ScanTicketModal } from "@/components/modals/ticket/scan-ticket-modal";
import { DeleteUserActorLinkModal } from "@/components/modals/userActorLink/delete-user-actor-link-modal";
import LinkUserActorModal from "@/components/modals/userActorLink/user-actor-link-modal";
import { DeleteUserExecutorLinkModal } from "@/components/modals/userExecutorLink/delete-user-executor-link-modal";
import LinkUserExecutorModal from "@/components/modals/userExecutorLink/user-executor-link-modal";
import { ShowBookedTicketsModal } from "@/components/modals/ticket/show-booked-tickets-modal";
import EditUserRoleModal from "@/components/modals/user/edit-user-role-modal";
import { ShareTicketModal } from "@/components/modals/ticket/share-ticket-modal";
import { EditTicketModal } from "@/components/modals/ticket/edit-ticket-modal";
import { QRTicketModal } from "@/components/modals/ticket/qr-ticket-modal";
import EditActorModal from "@/components/modals/actor/edit-actor-modal";

 const ModalProvider = () => {
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
      <EditActorModal />
      <DeleteActorModal />
      <DeletePlayModal />
      <CreateFestivalModal />
      <LinkActorPlayModal />
      <DeleteActorPlayLinkModal />
      <LinkExecutorPlayModal />
      <DeleteExecutorPlayLinkModal />
      <LinkFestivalPlayModal />
      <DeleteFestivalPlayLinkModal />
      <LinkCastMemberModal />
      <DeleteCastMemberModal />
      <DeleteUserModal />
      <DeleteTicketModal />
      <ScanTicketModal />
      <QRTicketModal />
      <LinkUserActorModal />
      <DeleteUserActorLinkModal />
      <LinkUserExecutorModal />
      <DeleteUserExecutorLinkModal />
      <ShowBookedTicketsModal />
      <ShareTicketModal />
      <EditTicketModal />
      <EditUserRoleModal />
    </>
  );
};

export default ModalProvider
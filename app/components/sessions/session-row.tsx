import React from "react";
import { Session } from "./session-list";

export interface SessionRowProps {
  session: Session;
  onClick?: () => void;
  onDelete?: () => void;
  onPlay?: () => void;
}

export const SessionRow: React.FC<SessionRowProps> = ({
  session,
  onClick,
  onDelete,
  onPlay,
}) => {
  return (
    <tr onClick={onClick} className="cursor-pointer hover:bg-zinc-900/50 transition-colors">
      <td>{session.id}</td>
    </tr>
  );
};

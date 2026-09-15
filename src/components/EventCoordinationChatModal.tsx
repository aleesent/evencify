import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Users,
  Shield,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Lock,
  Pin,
  Megaphone,
} from 'lucide-react';
import { EventCoordinationGroup, EventChatMessage, UserRole } from '../types';

interface EventCoordinationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: EventCoordinationGroup | null;
  currentUser: {
    id: string;
    name: string;
    role: UserRole;
    photoUrl?: string;
  };
  onSendMessage: (
    groupId: string,
    message: { content: string; isAnnouncement?: boolean }
  ) => void;
}

export const EventCoordinationChatModal: React.FC<EventCoordinationChatModalProps> = ({
  isOpen,
  onClose,
  group,
  currentUser,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, group?.messages]);

  if (!isOpen || !group) return null;

  // Verify access: Admin has full access.
  // Organiser must match group.organiserId.
  // Crew must be in group.crewMembers.
  const isOrganiser = currentUser.role === 'organiser' && currentUser.id === group.organiserId;
  const isAcceptedCrew =
    currentUser.role === 'crew' &&
    group.crewMembers.some((m) => m.crewId === currentUser.id);
  const isAdmin = currentUser.role === 'admin';

  const hasAccess = isAdmin || isOrganiser || isAcceptedCrew;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(group.id, {
      content: inputText.trim(),
      isAnnouncement: isAdmin && isAnnouncement,
    });

    setInputText('');
    setIsAnnouncement(false);
  };

  const handleQuickAction = (text: string, announcement = false) => {
    onSendMessage(group.id, {
      content: text,
      isAnnouncement: announcement || isAdmin,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl h-[88vh] rounded-2xl border border-neutral-200/90 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/70 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  Event Shift Coordination Group
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Strictly Organiser + Hired Crew Only
                </span>
                <span className="font-mono text-[10px] text-neutral-500 bg-neutral-200/80 px-1.5 py-0.5 rounded">
                  {group.eventId}
                </span>
              </div>

              <h2 className="mt-1 text-base sm:text-lg font-bold text-neutral-900 truncate">
                {group.eventName}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-600">
                <span className="flex items-center gap-1 font-medium text-neutral-800">
                  <Building2 className="h-3 w-3 text-neutral-400" />
                  Host: {group.organiserName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-neutral-400" />
                  {group.eventDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-neutral-400" />
                  {group.eventVenue}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowMemberList(!showMemberList)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  showMemberList
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
                title="View members"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Members</span>
                <span className="font-bold">({group.crewMembers.length + 1})</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Members Bar Drawer (Toggled or inline) */}
          {showMemberList && (
            <div className="mt-3 pt-3 border-t border-neutral-200/70 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Authorized Event Participants:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Organiser Card */}
                <div className="p-2 rounded-lg bg-white border border-purple-200/80 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ORG
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-neutral-900 truncate">{group.organiserName}</div>
                    <div className="text-[10px] text-purple-700 font-semibold">Event Organiser</div>
                  </div>
                </div>

                {/* Accepted Crew Cards */}
                {group.crewMembers.map((member) => (
                  <div
                    key={member.crewId}
                    className="p-2 rounded-lg bg-white border border-neutral-200 flex items-center gap-2"
                  >
                    {member.crewPhoto ? (
                      <img
                        src={member.crewPhoto}
                        alt={member.crewName}
                        referrerPolicy="no-referrer"
                        className="h-7 w-7 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold shrink-0">
                        {member.crewName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-neutral-900 truncate">{member.crewName}</div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {member.crewCategory} {member.phone ? `• ${member.phone}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Access Check */}
        {!hasAccess ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-md p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <Lock className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
              <h3 className="text-base font-bold text-neutral-900">Restricted Coordination Group</h3>
              <p className="text-xs text-neutral-600 mt-2">
                This shift group is exclusively reserved for the event organiser (
                <strong className="text-neutral-900">{group.organiserName}</strong>) and the{' '}
                <strong className="text-neutral-900">{group.crewMembers.length} accepted crew members</strong> hired for this event.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Action Chips */}
            <div className="px-4 py-2 border-b border-neutral-100 bg-white flex items-center gap-2 overflow-x-auto flex-shrink-0 text-xs text-neutral-600">
              <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap">
                Quick Prompts:
              </span>
              {(isOrganiser || isAdmin) && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        `📍 Location Pin: ${group.eventVenue}, Surat. Please use the East Entrance for crew check-in.`,
                        true
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                  >
                    📍 Share Venue Pin
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        `👔 Uniform Reminder: Please arrive in complete dress code with photo ID for wristband verification.`
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                  >
                    👔 Dress Code Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        `⏰ Call Time Alert: All crew must report 30 minutes prior to shift start for initial stage run-through.`
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                  >
                    ⏰ Shift Call Time
                  </button>
                </>
              )}
              {isAcceptedCrew && (
                <button
                  type="button"
                  onClick={() =>
                    handleQuickAction(
                      `✅ Checked in: I have arrived at ${group.eventVenue} and am ready for briefing.`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
                >
                  ✅ I have arrived at venue
                </button>
              )}
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-neutral-50/40">
              {group.messages.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  No messages yet. Send a greeting or shift instruction to get started.
                </div>
              ) : (
                group.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;

                  if (msg.isAnnouncement) {
                    return (
                      <div
                        key={msg.id}
                        className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-900 shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-amber-800 mb-1">
                          <Megaphone className="h-3.5 w-3.5 text-amber-600" />
                          <span>Official Shift Announcement • {msg.senderName}</span>
                          <span className="font-normal text-neutral-500 lowercase ml-auto text-[10px]">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="font-medium">{msg.content}</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-neutral-500">
                        <span className="font-bold text-neutral-800">{msg.senderName}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold uppercase ${
                            msg.senderRole === 'admin'
                              ? 'bg-neutral-900 text-white'
                              : msg.senderRole === 'organiser'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-neutral-400">• {msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-neutral-900 text-white rounded-br-xs'
                            : 'bg-white border border-neutral-200/90 text-neutral-900 rounded-bl-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-neutral-100 bg-white flex-shrink-0"
            >
              {isAdmin && (
                <div className="mb-2 flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnnouncement}
                      onChange={(e) => setIsAnnouncement(e.target.checked)}
                      className="h-3.5 w-3.5 accent-neutral-900 rounded cursor-pointer"
                    />
                    <span className="flex items-center gap-1">
                      <Megaphone className="h-3 w-3 text-amber-500" />
                      Post as High-Priority Shift Notice
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isOrganiser
                      ? 'Message your accepted event crew...'
                      : isAcceptedCrew
                      ? 'Reply to organiser or fellow crew...'
                      : 'Message as Platform Admin...'
                  }
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-hidden focus:border-neutral-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

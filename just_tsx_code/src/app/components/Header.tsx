import { MapPin, ChevronDown, Bell } from 'lucide-react';
import type { Town } from '@/domain/models';
import type { User } from '@/domain/auth';
import logo from 'figma:asset/d3b4c7636b6767777985706c8ec5912f3e236179.png';

interface HeaderProps {
  selectedTown: Town | null;
  onChangeTown: () => void;
  onNotifications?: () => void;
  user?: User;
}

export function Header({ selectedTown, onChangeTown, onNotifications, user }: HeaderProps) {
  return (
    <header className="bg-[#0060CF] border-b border-white/10 px-4 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Renizo"
            className="h-10 w-auto"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {onNotifications && (
            <button
              onClick={onNotifications}
              className="relative p-2.5 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}
          
          {selectedTown && (
            <button
              onClick={onChangeTown}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span className="font-medium text-white">{selectedTown.name}</span>
              <ChevronDown className="w-4 h-4 text-white/80" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
import { TimeValue } from "@/components/ui/Values";
import {
  CalendarDays,
  CircleDollarSign,
  Clock9,
  LucideProps,
  MapPin,
  Music2,
  UsersRound,
} from "lucide-react-native";

export interface FilterItem {
  icon: React.ComponentType<LucideProps>;
  label: string;
  value: string;
  children?: React.ReactNode;
  valueComponent?: React.ComponentType;
  valueComponentProps?: Record<string, any>;
}

export const filterConfigs: Record<string, FilterItem> = {
  location: {
    icon: MapPin,
    label: "Location",
    value: "San Francisco",
  },

  date: {
    icon: CalendarDays,
    label: "Dates",
    value: new Date()
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/(\w+) (\d+), (\d+)/, "$2 $1 $3"),
  },

  friendsAttend: {
    icon: UsersRound,
    label: "Friends attend",
    value: "12+",
  },

  time: {
    icon: Clock9,
    label: "Time",
    value: "7:00 pm",
    children: [],
    valueComponent: TimeValue,
    valueComponentProps: {
      value: 390,
    },
  },

  genres: {
    icon: Music2,
    label: "Genres",
    value: "",
  },

  price: {
    icon: CircleDollarSign,
    label: "Price",
    value: "",
  },
};

export const allFilters = Object.values(filterConfigs);

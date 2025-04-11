import { MusicPlayer } from "~/app/_components/MusicPlayer/MusicPlayer";
import Text from "~/widgets/Text";
import Text1 from "~/widgets/Text1";
import Text2 from "~/widgets/Text2";
export const COMPONENT_MAP = {
  Text: (props: any) => <Text {...props} />,
  Text1: (props: any) => <Text1 {...props} />,
  Text2: (props: any) => <Text2 {...props} />,
  MusicPlayer: (props: any) => <MusicPlayer {...props} />,
} as const;

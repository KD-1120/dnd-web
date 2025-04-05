import {
  ContainerBrickComponent,
  ContainerInspector,
} from './ContainerBrick';
import {
  HeadingBrickComponent,
  HeadingInspector,
} from './HeadingBrick';
import {
  ImageBrickComponent,
  ImageInspector,
} from './ImageBrick';
import {
  ButtonBrickComponent,
  ButtonInspector,
} from './ButtonBrick';
import {
  HeroBrickComponent,
  HeroInspector,
} from '../blocks/HeroBlock';
import {
  ImageHeroBrickComponent,
  ImageHeroInspector,
} from '../blocks/ImageHeroBlock';
import {
  FeaturesSectionBrickComponent,
  FeaturesSectionInspector,
} from '../blocks/FeaturesSectionBlock';
import {
  HeaderWithButtonBrickComponent,
  HeaderWithButtonInspector,
} from '../blocks/HeaderWithButtonBlock';
import {
  FeatureBrickComponent,
  FeatureBrickInspector,
} from './FeatureBrick';
import {
  ColumnBrickComponent,
  ColumnInspector,
} from './ColumnBrick';
import { NavigationBlockComponent, NavigationInspector } from '../blocks/NavigationBlock';

import { TitleBrickComponent, TitleBrickInspector } from './TitleBrick';
import { TextBrickComponent, TextBrickInspector } from './TextBrick';
import { IconBrickComponent, IconBrickInspector } from './IconBrick';
import ButtonGroupBrickComponent, { ButtonGroupInspector } from './ButtonGroupBrick';
import {ButtonWithIconBrickComponent, ButtonWithIconInspector} from './ButtonWithIconBrick';
import {
  Layout,
  Heading,
  Image as ImageIcon,
  RectangleHorizontal as ButtonIcon,
  Star,
  Layers,
  TextCursor,
  Columns,
  Video,
  Link,
  Navigation
} from 'lucide-react';
import { VideoBrickComponent, VideoInspector } from './VideoBrick';
import { LinksBrickComponent, LinksBrickInspector } from './LinksBrick';
import { FooterBrickComponent, FooterInspector } from './FooterBrick';
import ConferenceLandingPage, { ConferenceInspector } from '../templates/Landiing Pages/Conference';
import DigitalConferenceLanding, { DigitalInspector } from '../templates/Landiing Pages/Digital';
import { CounterBrickComponent, CounterInspector } from './CounterBrick';
import { Timer } from 'lucide-react';

export const BrickRegistry = {
  container: {
    component: ContainerBrickComponent,
    inspector: ContainerInspector,
    label: 'Container',
    icon: Layout,
    category: 'Layout',
    selfRenderChildren: true, // Container handles its own components
  },
  column: {
    component: ColumnBrickComponent,
    inspector: ColumnInspector,
    label: 'Column',
    icon: Layout,
    category: 'Layout',
    isNested: true,
  },
  heading: {
    component: HeadingBrickComponent,
    inspector: HeadingInspector,
    label: 'Heading',
    icon: Heading,
    category: 'Text',
  },
  image: {
    component: ImageBrickComponent,
    inspector: ImageInspector,
    label: 'Image',
    icon: ImageIcon,
    category: 'Media',
  },
  video: {
    component: VideoBrickComponent,
    inspector: VideoInspector,
    icon: Video,
    category: 'Media',
    label: 'Video',
  },
  button: {
    component: ButtonBrickComponent,
    inspector: ButtonInspector,
    label: 'Button',
    icon: ButtonIcon,
    category: 'Components',
    isNested: true,
  },
  hero: {
    component: HeroBrickComponent,
    inspector: HeroInspector,
    label: 'Hero',
    icon: Star,
    category: 'Layout',
  },
  imageHero: {
    component: ImageHeroBrickComponent,
    inspector: ImageHeroInspector,
    label: 'Image Hero',
    icon: Star,
    category: 'Layout',
  },
  featuresSection: {
    component: FeaturesSectionBrickComponent,
    inspector: FeaturesSectionInspector,
    label: 'Features Section',
    icon: Layers,
    category: 'Layout',
    allowsNested: true,
    selfRenderChildren: true,
  },
  headerWithButton: {
    component: HeaderWithButtonBrickComponent,
    inspector: HeaderWithButtonInspector,
    label: 'Header with Button',
    icon: Star,
    category: 'Layout',
  },
  feature: {
    component: FeatureBrickComponent,
    inspector: FeatureBrickInspector,
    label: 'Feature',
    icon: Star,
    category: 'Components',
    isNested: true,
  },
  title: {
    component: TitleBrickComponent,
    inspector: TitleBrickInspector,
    label: 'Title',
    icon: Heading,
    category: 'Text',
    isNested: true,
  },
  text: {
    component: TextBrickComponent,
    inspector: TextBrickInspector,
    label: 'Text',
    icon: TextCursor,
    category: 'Text',
    isNested: true,
  },
  icon: {
    component: IconBrickComponent,
    inspector: IconBrickInspector,
    label: 'Icon',
    icon: Star,
    category: 'Media',
    isNested: true,
  },
  buttonGroup: {
    component: ButtonGroupBrickComponent,
    inspector: ButtonGroupInspector,
    label: 'Button Group',
    icon: Columns,
    category: 'Components',
    allowsNested: true,
    selfRenderChildren: true,
  },
  buttonWithIcon: {
    component: ButtonWithIconBrickComponent,
    inspector: ButtonWithIconInspector,
    label: 'Button with Icon',
    icon: ButtonIcon,
    category: 'Components',
    isNested: true,
  },
  links: {
    component: LinksBrickComponent,
    inspector: LinksBrickInspector,
    label: 'Link',
    icon: Link,
    category: 'Navigation',
    isNested: true,
  },
  navigation: {
    component: NavigationBlockComponent,
    inspector: NavigationInspector,
    label: 'Navigation',
    icon: Navigation,
    category: 'Navigation',
    allowsNested: true,
    selfRenderChildren: true,
  },
  footer: {
    component: FooterBrickComponent,
    inspector: FooterInspector,
    label: 'Footer',
    icon: Layout,
    category: 'Layout',
    allowsNested: true,
    selfRenderChildren: true,
  },
  conference: {
    component: ConferenceLandingPage,
    inspector: ConferenceInspector,
    label: 'Conference Landing',
    icon: Star,
    category: 'Landing Pages',
    defaultProps: {
      padding: '0',
      marginBottom: '0'
    }
  },
  digital: {
    component: DigitalConferenceLanding,
    inspector: DigitalInspector,
    label: 'Digital Conference',
    icon: Star,
    category: 'Landing Pages',
    defaultProps: {
      padding: '0',
      marginBottom: '0'
    }
  },
  counter: {
    component: CounterBrickComponent,
    inspector: CounterInspector,
    label: 'Counter',
    icon: Timer,
    category: 'Components',
  },
};
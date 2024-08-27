import Image, { ImageLoaderProps, ImageProps } from "next/image";
import arrow from "@/public/icons/arrow.png";
import arrowGray from "@/public/icons/arrow-gray.png";
import whiteArrow from "@/public/icons/white-arrow.png";
import headerLogo from "@/public/dropper-logo.png";
import headerIcon from "@/public/header-icon.png";
import logo from "@/public/logo.png";
import icon from "@/public/icon.png";
import apple from "@/public/icons/apple.png";
import contributor from "@/public/icons/contributor.png";
import docs from "@/public/icons/docs.png";
import discord from "@/public/icons/discord.png";
import filter2 from "@/public/icons/filter 2.png";
import filter from "@/public/icons/filter.png";
import google from "@/public/icons/google.png";
import launchpad from "@/public/icons/launchpad.png";
import list2 from "@/public/icons/list 2.png";
import list from "@/public/icons/list.png";
import login from "@/public/icons/login.png";
import logout from "@/public/icons/logout.png";
import panel from "@/public/icons/panel.png";
import passkey from "@/public/icons/passkey.png";
import twitter from "@/public/icons/twitter.png";
import wallet from "@/public/icons/wallet.png";
import web from "@/public/icons/web.png";
import telegram from "@/public/icons/telegram.png";
import dropper from "@/public/icons/dropper.png";
import menu from "@/public/icons/menu.png";
import confetti from "@/public/icons/confetti.png";
import notification from "@/public/icons/notification.png";
import angry from "@/public/icons/angry.png";
import solana from "@/public/icons/solana.png";
import solanaColor from "@/public/icons/solana-color.png";
import spl from "@/public/icons/spl.png";
import splColor from "@/public/icons/spl-color.png";
import x from "@/public/icons/x.png";
import xColor from "@/public/icons/x-color.png";
import telegramColor from "@/public/icons/telegram-color.png";
import discordColor from "@/public/icons/discord-color.png";
import dexscreener from "@/public/icons/dexscreener.png";
import dexscreenerColor from "@/public/icons/dexscreener-color.png";
import pump from "@/public/icons/pump.png";
import pumpColor from "@/public/icons/pump-color.png";
import moonshot from "@/public/icons/moonshot.png";
import moonshotColor from "@/public/icons/moonshot-color.png";
import degen from "@/public/icons/degen.png";
import degenColor from "@/public/icons/degen-color.png";
import shrug from "@/public/icons/shrug.png";
import questionCoin from "@/public/icons/question-coin.png";
import eyes from "@/public/icons/eyes.png";
import hold from "@/public/icons/hold.png";
import hourglass from "@/public/icons/hourglass.png";
import falling from "@/public/icons/falling.png";
import logoWhite from "@/public/Dropper_Logo_White.png";
import logoBlack from "@/public/Dropper_Logo_Black.png";
import dropzone from "@/public/dropzone.gif";

type IconProps = {} & Omit<ImageProps, "src" | "alt">;

export const Dropzone = ({ ...props }: IconProps) => (
  <Image {...props} src={dropzone} alt="Dropzone" />
);

export const LogoWhite = ({ ...props }: IconProps) => (
  <Image {...props} src={logoWhite} alt="Logo White" />
);

export const LogoBlack = ({ ...props }: IconProps) => (
  <Image {...props} src={logoBlack} alt="Logo Black" />
);

export const Falling = ({ ...props }: IconProps) => (
  <Image {...props} src={falling} alt="falling" />
);

export const Hourglass = ({ ...props }: IconProps) => (
  <Image {...props} src={hourglass} alt="hourglass" />
);

export const Hold = ({ ...props }: IconProps) => (
  <Image {...props} src={hold} alt="hold" />
);

export const Eyes = ({ ...props }: IconProps) => (
  <Image {...props} src={eyes} alt="eyes" />
);

export const QuestionCoin = ({ ...props }: IconProps) => (
  <Image {...props} src={questionCoin} alt="question coin" />
);

export const Shrug = ({ ...props }: IconProps) => (
  <Image {...props} src={shrug} alt="shrug" />
);

export const Dexscreener = ({ ...props }: IconProps) => (
  <Image {...props} src={dexscreener} alt="dexscreener" />
);

export const DexscreenerColor = ({ ...props }: IconProps) => (
  <Image {...props} src={dexscreenerColor} alt="dexscreener color" />
);

export const Pump = ({ ...props }: IconProps) => (
  <Image {...props} src={pump} alt="pump" />
);

export const PumpColor = ({ ...props }: IconProps) => (
  <Image {...props} src={pumpColor} alt="pump color" />
);

export const Moonshot = ({ ...props }: IconProps) => (
  <Image {...props} src={moonshot} alt="moonshot" />
);

export const MoonshotColor = ({ ...props }: IconProps) => (
  <Image {...props} src={moonshotColor} alt="moonshot color" />
);

export const Degen = ({ ...props }: IconProps) => (
  <Image {...props} src={degen} alt="degen" />
);

export const DegenColor = ({ ...props }: IconProps) => (
  <Image {...props} src={degenColor} alt="degen color" />
);

export const DiscordColor = ({ ...props }: IconProps) => (
  <Image {...props} src={discordColor} alt="discord color" />
);

export const TelegramColor = ({ ...props }: IconProps) => (
  <Image {...props} src={telegramColor} alt="telegram" />
);

export const X = ({ ...props }: IconProps) => (
  <Image {...props} src={x} alt="x" />
);

export const XColor = ({ ...props }: IconProps) => (
  <Image {...props} src={xColor} alt="x color" />
);

export const Spl = ({ ...props }: IconProps) => (
  <Image {...props} src={spl} alt="spl" />
);

export const SplColor = ({ ...props }: IconProps) => (
  <Image {...props} src={splColor} alt="spl color" />
);

export const Solana = ({ ...props }: IconProps) => (
  <Image {...props} src={solana} alt="solana" />
);

export const SolanaColor = ({ ...props }: IconProps) => (
  <Image {...props} src={solanaColor} alt="solana color" />
);

export const Angry = ({ ...props }: IconProps) => (
  <Image {...props} src={angry} alt="ANGRY" />
);

export const Notification = ({ ...props }: IconProps) => (
  <Image {...props} src={notification} alt="Notification" />
);

export const Confetti = ({ ...props }: IconProps) => (
  <Image {...props} src={confetti} alt="Confetti" />
);

export const Menu = ({ ...props }: IconProps) => (
  <Image {...props} src={menu} alt="Menu" />
);

export const Dropper = ({ ...props }: IconProps) => (
  <Image {...props} src={dropper} alt="Dropper" />
);

export const Arrow = (props: IconProps) => (
  <Image {...props} src={arrow} alt="Arrow" />
);

export const ArrowGray = (props: IconProps) => (
  <Image {...props} src={arrowGray} alt="Arrow" />
);

export const WhiteArrow = ({ ...props }: IconProps) => (
  <Image {...props} src={whiteArrow} alt="White Arrow" />
);

export const HeaderLogo = ({ ...props }: IconProps) => (
  <Image {...props} src={headerLogo} alt="Header Logo" />
);

export const HeaderIcon = ({ ...props }: IconProps) => (
  <Image {...props} src={headerIcon} alt="Header Icon" />
);

export const Logo = ({ ...props }: IconProps) => (
  <Image {...props} src={logo} alt="Logo" />
);

export const Icon = ({ ...props }: IconProps) => (
  <Image {...props} src={icon} alt="Icon" />
);

export const Apple = ({ ...props }: IconProps) => (
  <Image {...props} src={apple} alt="Apple" />
);

export const Contributor = ({ ...props }: IconProps) => (
  <Image {...props} src={contributor} alt="Contributor" />
);

export const Discord = ({ ...props }: IconProps) => (
  <Image {...props} src={discord} alt="Discord" />
);

export const Docs = ({ ...props }: IconProps) => (
  <Image {...props} src={docs} alt="Docs" />
);

export const Filter2 = ({ ...props }: IconProps) => (
  <Image {...props} src={filter2} alt="Filter 2" />
);

export const Filter = ({ ...props }: IconProps) => (
  <Image {...props} src={filter} alt="Filter" />
);

export const Google = ({ ...props }: IconProps) => (
  <Image {...props} src={google} alt="Google" />
);

export const Launchpad = ({ ...props }: IconProps) => (
  <Image {...props} src={launchpad} alt="Launchpad" />
);

export const List2 = ({ ...props }: IconProps) => (
  <Image {...props} src={list2} alt="List 2" />
);

export const List = ({ ...props }: IconProps) => (
  <Image {...props} src={list} alt="List" />
);

export const Login = ({ ...props }: IconProps) => (
  <Image {...props} src={login} alt="Login" />
);

export const Logout = ({ ...props }: IconProps) => (
  <Image {...props} src={logout} alt="Logout" />
);

export const Panel = ({ ...props }: IconProps) => (
  <Image {...props} src={panel} alt="Panel" />
);

export const Passkey = ({ ...props }: IconProps) => (
  <Image {...props} src={passkey} alt="Passkey" />
);

export const Twitter = ({ ...props }: IconProps) => (
  <Image {...props} src={twitter} alt="Twitter" />
);

export const Wallet = ({ ...props }: IconProps) => (
  <Image {...props} src={wallet} alt="Wallet" />
);

export const Web = ({ ...props }: IconProps) => (
  <Image {...props} src={web} alt="Web" />
);

export const Telegram = ({ ...props }: IconProps) => (
  <Image {...props} src={telegram} alt="Telegram" />
);

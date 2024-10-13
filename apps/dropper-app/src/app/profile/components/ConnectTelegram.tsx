export default function ConnectTelegram() {
  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="text-3xl">Connect Telegram</h2>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="DropperWTFBot"
        data-size="large"
        data-radius="6"
        data-auth-url="http://localhost:3000/auth/callback/telegram"
      >
        test
      </script>
    </div>
  );
}

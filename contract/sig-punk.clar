;; Sig-Punk
;; create a sip009 nft

;; explicitly assert conformity with depending traits.
(impl-trait 'ST1R54GFBKWHS57G21ERQWB1BJMQ81127BR28QCKS.sig-trait.sig-trait)

;; constants
;; contract deployer
(define-constant CONTRACT_OWNER tx-sender)

(define-constant MINT u5)

;; constant error codes
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-id-failure (err u102))

;; data maps and vars
;; define NFT's unique asset name (per contract) and asset identifier
(define-non-fungible-token Sig-Punk uint)
;; increment a counter variable each time a new NFT is minted
(define-data-var last-token-id uint u0)
(define-data-var base-uri (string-ascii 80) "https://ipfs.io/ipfs/QmW55oUp4FjgWFN2mqbwvkcx2jKumUaULKQygbztUbr1A6/")
;; private functions
;;

;; public functions
;;

;; track the last token ID
(define-read-only (get-last-token-id) 
    (ok (var-get last-token-id))
)

;; return a link to the metadata of a specified NFT (or none)
;; (define-read-only (get-token-uri (id uint)) 
;;     (ok none)
;; )

(define-read-only (get-token-uri (id uint))
  (ok (some (concat (concat (var-get base-uri) (uint-to-ascii id)) ".json"))))

;; concat root url + token ID in a straightforward link
;; (concat "https://domain.tld/metadata/" (to-ascii token-id))

;; wrap the built-in nft-get-owner? function
(define-read-only (get-owner (id uint)) 
    (ok (nft-get-owner? Sig-Punk id))
)

(define-read-only (uint-to-ascii (value uint))  
(if (<= value u9)    
(unwrap-panic (element-at "0123456789" value))    
(get r (fold uint-to-ascii-inner       
0x000000000000000000000000000000000000000000000000000000000000000000000000000000          
{v: value, r: ""}    ))  ))

(define-read-only (uint-to-ascii-inner (i (buff 1)) (d {v: uint, r: (string-ascii 39)}))
  (if (> (get v d) u0)
    {
      v: (/ (get v d) u10),
      r: (unwrap-panic (as-max-len? (concat (unwrap-panic (element-at "0123456789" (mod (get v d) u10))) (get r d)) u39))
    }
    d
  )
)

;; transfer function should assert that sender == tx-sender.
(define-public (transfer (id uint) (sender principal) (recipient principal)) 
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (nft-transfer? Sig-Punk id sender recipient)
    )
)

;; minting function must prevent others than contract-owner to mint new tokens
(define-public (mint (recipient principal))
	(let ((token-id (+ (var-get last-token-id) u1)))
		(asserts! (is-eq tx-sender CONTRACT_OWNER) err-owner-only)
		(try! (nft-mint? Sig-Punk token-id recipient))
		(asserts! (var-set last-token-id token-id) err-token-id-failure)
		(ok token-id)
	)
)
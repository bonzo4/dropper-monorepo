import Button from "@repo/ui/Button";
import Select from "@repo/ui/Select";
import { Filter } from "@repo/ui/Icons";
import { useState } from "react";

type AirdropFilterProps = {
  sort: string;
  setSort: (sort: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  blockchain?: string;
  setBlockchain: (blockchain: string) => void;
  category?: string;
  setCategory: (category: string) => void;
};

const AirdropFilter = ({
  sort,
  setSort,
  sortBy,
  setSortBy,
  blockchain,
  setBlockchain,
  category,
  setCategory,
}: AirdropFilterProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="">
      <Button className="flex flex-row gap-2" onClick={() => setShow(!show)}>
        <Filter width={20} /> <span>Filter</span>
      </Button>
      <div
        className="absolute bg-black bg-opacity-50 inset-0 z-20 items-center justify-center hover:cursor-pointer"
        style={{ display: show ? "flex" : "none" }}
        onClick={(e) => (e.target === e.currentTarget ? setShow(false) : null)}
      >
        <div className="flex flex-col bg-secondary p-5 gap-6 z-40 cursor-auto">
          <div className="flex flex-row justify-between items-center gap-4">
            <h2 className="text-xl">Filter Settings</h2>
            <Button onClick={() => setShow(false)}>
              <span>Close</span>
            </Button>
          </div>
          <div className="flex flex-col bg-secondary gap-4">
            <div className="flex flex-row justify-between items-center gap-4">
              <label htmlFor="sort">Sort By</label>
              <Select
                defaultValue={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="created_at">Created At</option>
                <option value="title">Title</option>
                <option value="est_airdrop_size">Est. Airdrop</option>
                <option value="likelihood">Likelihood</option>
                <option value="questers">Questers</option>
                <option value="sentiment">Sentiment</option>
              </Select>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <label htmlFor="sort direction">Sort Direction</label>
              <Select
                defaultValue={sort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSort(e.target.value)
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Select>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <label htmlFor="sort direction">Category</label>
              <Select
                defaultValue={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCategory(e.target.value)
                }
              >
                <option value=""></option>
                <option value="DeFi">DeFi</option>
                <option value="NFT">NFT</option>
                <option value="Meme">Meme</option>
                <option value="Shitcoin">Shitcoin</option>
                <option value="Gaming">Gaming</option>
              </Select>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <label htmlFor="sort direction">Blockchain</label>
              <Select
                defaultValue={blockchain}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setBlockchain(e.target.value)
                }
              >
                <option value=""></option>
                <option value="Solana">Solana</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Bitcoin">Bitcoin</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropFilter;

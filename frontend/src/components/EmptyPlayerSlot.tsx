type EmptyPlayerSlotProps = {
  slot: number;
};

function EmptyPlayerSlot({ slot }: EmptyPlayerSlotProps) {
  return (
    <div className="hidden min-h-[152px] flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-[#464554]/60 bg-[#1b1b23]/35 p-4 text-[#908fa0] transition hover:border-[#908fa0]/60 hover:bg-[#1f1f27]/55 sm:flex">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#292932]/60 text-3xl font-light text-[#c7c4d7]/75">
        <span
          className="material-symbols-outlined text-[32px]"
          data-icon="person_add"
          aria-hidden="true"
        >
          person_add
        </span>
      </div>
      <p className="text-[10px] font-black tracking-[0.18em] uppercase">
        {slot === 0 ? "Inviting" : "Empty Slot"}
      </p>
    </div>
  );
}

export default EmptyPlayerSlot;

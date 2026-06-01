import React from "react";
import { View } from "react-native";

export default function JournalScreen({
  theme,
  journalEntries,
  pickJournalPhoto,
  JournalCard,
}) {
  return (
    <View>
      <JournalCard
        theme={theme}
        journalEntries={journalEntries}
        onAddGeneralPhoto={() =>
          pickJournalPhoto("Garden")
        }
      />
    </View>
  );
}
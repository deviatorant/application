package com.example.modernapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Adapter for displaying features in a RecyclerView
 */
public class FeatureAdapter extends RecyclerView.Adapter<FeatureAdapter.FeatureViewHolder> {

    private List<Feature> features;
    private Context context;
    private OnFeatureClickListener listener;

    /**
     * Interface for click events on features
     */
    public interface OnFeatureClickListener {
        void onFeatureClick(Feature feature, int position);
    }

    /**
     * Constructs a new FeatureAdapter
     *
     * @param context  the context
     * @param features the list of features
     * @param listener the click listener
     */
    public FeatureAdapter(Context context, List<Feature> features, OnFeatureClickListener listener) {
        this.context = context;
        this.features = features;
        this.listener = listener;
    }

    @NonNull
    @Override
    public FeatureViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_feature, parent, false);
        return new FeatureViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FeatureViewHolder holder, int position) {
        Feature feature = features.get(position);
        holder.imageViewItem.setImageResource(feature.getIconResourceId());
        holder.textViewTitle.setText(feature.getTitle());
        holder.textViewDescription.setText(feature.getDescription());

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onFeatureClick(feature, position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return features.size();
    }

    /**
     * ViewHolder for feature items
     */
    public static class FeatureViewHolder extends RecyclerView.ViewHolder {
        ImageView imageViewItem;
        TextView textViewTitle;
        TextView textViewDescription;

        public FeatureViewHolder(@NonNull View itemView) {
            super(itemView);
            imageViewItem = itemView.findViewById(R.id.imageViewItem);
            textViewTitle = itemView.findViewById(R.id.textViewTitle);
            textViewDescription = itemView.findViewById(R.id.textViewDescription);
        }
    }
}
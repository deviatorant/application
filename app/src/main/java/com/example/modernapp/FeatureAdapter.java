package com.example.modernapp;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Adapter for displaying a list of features in a RecyclerView
 */
public class FeatureAdapter extends RecyclerView.Adapter<FeatureAdapter.FeatureViewHolder> {

    private List<Feature> features;
    private Context context;

    /**
     * Constructor for FeatureAdapter
     *
     * @param context  The context
     * @param features The list of features to display
     */
    public FeatureAdapter(Context context, List<Feature> features) {
        this.context = context;
        this.features = features;
    }

    @NonNull
    @Override
    public FeatureViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_feature, parent, false);
        return new FeatureViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FeatureViewHolder holder, int position) {
        Feature feature = features.get(position);
        holder.titleTextView.setText(feature.getTitle());
        holder.descriptionTextView.setText(feature.getDescription());
        holder.iconImageView.setImageResource(feature.getIconResId());

        // Set click listener to launch the corresponding activity
        holder.cardView.setOnClickListener(v -> {
            Intent intent = new Intent(context, feature.getActivityClass());
            context.startActivity(intent);
            
            // If the context is an activity, apply custom animation
            if (context instanceof MainActivity) {
                ((MainActivity) context).overridePendingTransition(
                        R.anim.slide_in_right, R.anim.slide_out_left);
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
    static class FeatureViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView iconImageView;
        TextView titleTextView;
        TextView descriptionTextView;

        FeatureViewHolder(View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.featureCardView);
            iconImageView = itemView.findViewById(R.id.featureIconImageView);
            titleTextView = itemView.findViewById(R.id.featureTitleTextView);
            descriptionTextView = itemView.findViewById(R.id.featureDescriptionTextView);
        }
    }
}